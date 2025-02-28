#!/bin/bash

BASE_DIR="."

find "$BASE_DIR" -type d -name '\$errors' | while read -r dir; do
    new_name="$(dirname "$dir")/errors"
    if [ "$dir" != "$new_name" ]; then
        mv "$dir" "$new_name"
        echo "Renamed: $dir -> $new_name"
    fi
done

