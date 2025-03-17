#!/bin/bash
# Directory containing the markdown files
NOTES_DIR="./reference/rel-notes/"
# Process each markdown file matching the pattern
find "$NOTES_DIR" -name "spaces-v*.md" | while read -r file; do
  # Extract version from filename (spaces-vX.X.X.md)
  filename=$(basename "$file")
  if [[ $filename =~ spaces-v([0-9]+)\.([0-9]+)\.([0-9]+)\.md ]]; then
    major="${BASH_REMATCH[1]}"
    minor="${BASH_REMATCH[2]}"
    patch="${BASH_REMATCH[3]}"
    
    echo "Found version: $major.$minor.$patch in file $filename"
    
    # Format version numbers with padding (0001.0010.0004)
    padded_major=$(printf "%04d" "$major")
    padded_minor=$(printf "%04d" "$minor")
    padded_patch=$(printf "%04d" "$patch")
    version_key="$padded_major.$padded_minor.$padded_patch"
    
    # Check if version_sort_key already exists in the frontmatter
    if ! grep -q "version_sort_key:" "$file"; then
      # Create temporary file
      temp_file=$(mktemp)
      
      # Add version_sort_key just before the closing --- of frontmatter
      awk -v key="$version_key" '
        BEGIN { in_front = 0; }
        /^---$/ {
          if (in_front == 0) {
            in_front = 1;
            print "---";
          } else {
            print "version_sort_key: \"" key "\"";
            print "---";
            in_front = 0;
          }
          next;
        }
        { print }
      ' "$file" > "$temp_file"
      
      # Check file size to ensure we didn't destroy content
      if [ -s "$temp_file" ]; then
        # Replace original file with modified version
        mv "$temp_file" "$file"
        echo "Added version_sort_key: \"$version_key\" to $filename"
      else
        echo "Error: Generated empty file for $filename, skipping"
        rm "$temp_file"
      fi
    else
      echo "version_sort_key already exists in $filename, skipping"
    fi
  else
    echo "Warning: Filename $filename doesn't match expected pattern spaces-vX.X.X.md"
    echo "Actual pattern: $filename"
  fi
done
echo "Processing complete!"
