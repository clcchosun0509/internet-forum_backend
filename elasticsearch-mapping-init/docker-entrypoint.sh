#!/bin/bash

for i in {30..0}; do
    if curl elasticsearch:9200; then
        curl -XPUT elasticsearch:9200/hahaha-post -d @elastic-config-post.json -H 'Content-Type: application/x-ndjson';

        break;
    fi
    sleep 2
done

for i in {30..0}; do
    if curl elasticsearch:9200; then
        curl -XPUT elasticsearch:9200/hahaha-user -d @elastic-config-user.json -H 'Content-Type: application/x-ndjson';
        break;
    fi
    sleep 2
done
