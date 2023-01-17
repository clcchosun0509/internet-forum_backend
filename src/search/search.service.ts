import {
  QueryDslBoolQuery,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/types';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { createPaginationObject } from 'nestjs-typeorm-paginate';
import { BoardId } from '../entities/board-id.type';
import { PostService } from '../post/post.service';
import { SearchQueryDto } from './dtos/search-post-query.dto';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly postService: PostService,
  ) {}

  async searchTitleWithContent(
    { query, boardId, page }: SearchQueryDto,
    limit: number,
  ) {
    return await this.searchPosts(boardId, page, limit, [
      { match_phrase: { title: query } },
      { match_phrase: { content: { query, slop: 1 } } },
    ]);
  }

  async searchTitle({ query, boardId, page }: SearchQueryDto, limit: number) {
    return await this.searchPosts(boardId, page, limit, [
      { match_phrase: { title: query } },
    ]);
  }

  async searchUser({ query, boardId, page }: SearchQueryDto, limit: number) {
    const userBoolQuery = {
      must: [
        {
          match: {
            username: query,
          },
        },
      ],
      should: [
        {
          match_phrase_prefix: {
            username: query,
          },
        },
        {
          match: {
            'username.keyword': query,
          },
        },
      ],
    };
    const { ids } = await this.search<string>(
      userBoolQuery,
      1,
      5,
      'hahaha-user',
    );

    const shouldQuery = ids.map((id) => ({
      match: {
        'author_id.keyword': id,
      },
    }));

    return await this.searchPosts(boardId, page, limit, shouldQuery);
  }

  private async searchPosts(
    boardId: BoardId,
    page: number,
    limit: number,
    shouldQuery: QueryDslQueryContainer[],
  ) {
    const boolQuery = {
      filter: [
        { match: { board_id: boardId } },
        {
          bool: {
            should: shouldQuery,
          },
        },
      ],
    };

    const { ids, totalItems } = await this.search<number>(
      boolQuery,
      page,
      limit,
      'hahaha-post',
    );

    const items = await this.postService.getPostsByPostIds(ids);

    return createPaginationObject({
      items,
      totalItems,
      currentPage: page,
      limit,
    });
  }

  private async search<T>(
    boolQuery: QueryDslBoolQuery,
    page: number,
    limit: number,
    index: string,
  ) {
    const searchParams = {
      index,
      body: {
        query: {
          bool: boolQuery,
        },
        sort: [{ created_at: 'desc' }],
        from: (page - 1) * limit,
        size: limit,
      },
    };
    let ids: T[] = [];
    let totalItems = 0;
    try {
      const body = await this.elasticsearchService.search<{ id: T }>(
        searchParams,
      );
      ids = body.hits.hits.map(({ _source }) => _source.id);
      const hitsTotal = body.hits.total.valueOf();
      if (
        typeof hitsTotal === 'object' &&
        typeof (hitsTotal as any).value === 'number'
      ) {
        totalItems = (hitsTotal as any).value;
      } else {
        throw new Error(`잘못된 hitsTotal 값, 받은 hitsTotal: ${hitsTotal}`);
      }
    } catch (error) {
      console.error('error in search', error);
      throw new ServiceUnavailableException(
        '검색엔진이 아직 준비되지 않았습니다',
      );
    }

    return {
      ids,
      totalItems,
    };
  }
}
