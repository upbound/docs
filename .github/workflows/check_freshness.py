import os
import subprocess
from datetime import datetime, timedelta

# Define the freshness
FRESHNESS_PERIOD = timedelta(days=180)
IGNORED_FILES = ["_index.md", "support.md"]

# Get date
now = datetime.now()

def get_last_modified_time(file_path):
    # Use git log to find the last modified time of the file
    result = subprocess.run(
        ['git', 'log', '-1', '--format=%ct', file_path],
        stdout=subprocess.PIPE,
        text=True
    )
    # Convert timestamp to datetime
    timestamp = int(result.stdout.strip())
    return datetime.fromtimestamp(timestamp)

def check_freshness(directory):
    stale_files = []

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                relative_path = os.path.relpath(os.path.join(root, file), start=directory)
                if file in IGNORED_FILES:
                    continue

                last_modified = get_last_modified_time(os.path.join(root, file))
                time_diff = now - last_modified
                if time_diff > FRESHNESS_PERIOD:
                    stale_files.append((relative_path, last_modified))

    return stale_files

docs_directory = "content"

stale_docs = check_freshness(docs_directory)

sorted_stale_docs = sorted(stale_docs, key=lambda x: x[1])

if sorted_stale_docs:
    print("The following docs have not been modified for at least 6 months:")
    for doc, mod_time in sorted_stale_docs:
        print(f"{doc}, {mod_time.strftime('%Y-%m-%d')}")
else:
    print("All documents are fresh!")