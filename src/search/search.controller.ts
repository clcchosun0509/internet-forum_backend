import { Controller, Get, Query } from '@nestjs/common';
import { SearchQueryDto } from './dtos/search-post-query.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('titleWithContent')
  searchTitleWithContent(@Query() query: SearchQueryDto) {
    return this.searchService.searchTitleWithContent(query, 20)
  }

  @Get('title')
  searchTitle(@Query() query: SearchQueryDto) {
    return this.searchService.searchTitle(query, 20)
  }

  @Get('user')
  searchUser(@Query() query: SearchQueryDto) {
    return this.searchService.searchUser(query, 20)
  }
}
