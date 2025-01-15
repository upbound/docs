#!/bin/bash

# Define the root directory of your project
PROJECT_ROOT="/Users/rae/up-docs-fork/content"

# Function to resolve references
resolve_ref() {
    local ref_path="$1"
    local ref_line="$2"
    local ref_file="$3"

    if [[ -z "$ref_path" ]]; then
        echo "ERROR: Reference path is empty. Check the input format or file structure."
        return
    fi

    # Check if the reference exists
    local target_path="$PROJECT_ROOT/$ref_path"
    if [[ -f "$target_path" || -d "$target_path" ]]; then
        echo "OK: Reference '$ref_path' in file '$ref_file' at line $ref_line is valid."
    else
        echo "FIX: Reference '$ref_path' in file '$ref_file' at line $ref_line not found."
        echo "    Suggestion: Check the directory structure or correct the reference."
    fi
}

# Process errors and warnings
while IFS= read -r line; do
    if [[ "$line" == ERROR*REF_NOT_FOUND:* ]]; then
        # Extract reference, file, and line number
        ref=$(echo "$line" | sed -n 's/.*Ref "\(.*\)": "\(.*\):\([0-9]\+\):.*/\1/p')
        file=$(echo "$line" | sed -n 's/.*Ref "\(.*\)": "\(.*\):.*/\2/p')
        line_number=$(echo "$line" | sed -n 's/.*Ref "\(.*\)": "\(.*\):\([0-9]\+\).*/\3/p')

        # Attempt to resolve the reference
        resolve_ref "$ref" "$line_number" "$file"
    elif [[ "$line" == WARN*Unable*find*image* ]]; then
        # Extract image path and file
        img=$(echo "$line" | sed -n 's/.*image \(.*\) on page \(.*\)/\1/p')
        file=$(echo "$line" | sed -n 's/.*on page \(.*\)/\1/p')

        # Check if the image exists
        if [[ -f "$PROJECT_ROOT/$img" ]]; then
            echo "OK: Image '$img' in file '$file' exists."
        else
            echo "FIX: Image '$img' in file '$file' not found."
            echo "    Suggestion: Ensure the image is in the correct location or update the reference."
        fi
    fi
done <<EOF
ERROR [en] REF_NOT_FOUND: Ref "./python/overview": "/Users/rae/up-docs-fork/content/learn/core-concepts/_index.md:14:12": page not found
ERROR [en] REF_NOT_FOUND: Ref "./kcl/overview": "/Users/rae/up-docs-fork/content/learn/core-concepts/_index.md:15:9": page not found
WARN  Unable to find image all-spaces/spaces/images/attached-space.png on page ./content/self-hosted-qs
EOF

echo "Completed processing references."

