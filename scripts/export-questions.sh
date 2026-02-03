#!/bin/bash

# Export Questions Script
# Exports all questions from the database to JSON format
# This script can be run from any directory

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root to ensure paths work correctly
cd "$PROJECT_ROOT"

DB_NAME="${DB_NAME:-pmp_app}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Output file (default: questions_export_YYYYMMDD_HHMMSS.json)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="${OUTPUT_FILE:-questions_export_${TIMESTAMP}.json}"

echo "📤 Exporting questions from database..."
echo "Project root: $PROJECT_ROOT"
echo "Database: $DB_NAME"
echo "Output file: $OUTPUT_FILE"
echo ""

# Function to find PostgreSQL binaries
find_postgres_bin() {
    local bin_name=$1
    
    # Check if in PATH
    if command -v "$bin_name" &> /dev/null; then
        command -v "$bin_name"
        return 0
    fi
    
    # Check Postgres.app (macOS)
    if [ -d "/Applications/Postgres.app" ]; then
        local postgres_app_bin="/Applications/Postgres.app/Contents/Versions/latest/bin/$bin_name"
        if [ -f "$postgres_app_bin" ]; then
            echo "$postgres_app_bin"
            return 0
        fi
        # Try other versions
        for version_dir in /Applications/Postgres.app/Contents/Versions/*/; do
            if [ -f "${version_dir}bin/$bin_name" ]; then
                echo "${version_dir}bin/$bin_name"
                return 0
            fi
        done
    fi
    
    # Check Homebrew locations
    for brew_path in "/opt/homebrew/opt/postgresql@15/bin/$bin_name" \
                     "/opt/homebrew/opt/postgresql/bin/$bin_name" \
                     "/usr/local/opt/postgresql@15/bin/$bin_name" \
                     "/usr/local/opt/postgresql/bin/$bin_name"; do
        if [ -f "$brew_path" ]; then
            echo "$brew_path"
            return 0
        fi
    done
    
    return 1
}

# Find PostgreSQL binaries
PSQL_CMD=$(find_postgres_bin psql)

if [ -z "$PSQL_CMD" ]; then
    echo "❌ Error: psql command not found"
    echo ""
    echo "PostgreSQL client tools are not installed or not in your PATH."
    echo "See INSTALL_POSTGRESQL.md for installation instructions."
    echo ""
    exit 1
fi

echo "✓ PostgreSQL tools found: $PSQL_CMD"
echo ""

# Check if database exists
if ! $PSQL_CMD -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "❌ Error: Database '$DB_NAME' does not exist."
    echo "   Create it with: ./scripts/db-setup.sh"
    exit 1
fi

echo "✓ Database found"
echo ""

# Export questions with all related data
echo "Exporting questions..."

# Create SQL query to export questions with answers as JSON
SQL_QUERY="
SELECT json_agg(
    json_build_object(
        'id', q.id,
        'question_id', q.question_id,
        'question_type', q.question_type,
        'certification_name', c.name,
        'knowledge_area_name', ka.name,
        'domain', q.domain,
        'task', q.task,
        'pm_approach', q.pm_approach,
        'question_text', q.question_text,
        'explanation', q.explanation,
        'difficulty', q.difficulty,
        'question_images', q.question_images,
        'explanation_images', q.explanation_images,
        'question_metadata', q.question_metadata,
        'is_active', q.is_active,
        'created_at', q.created_at,
        'updated_at', q.updated_at,
        'answers', COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'id', a.id,
                        'answer_text', a.answer_text,
                        'is_correct', a.is_correct,
                        'order', a.\"order\"
                    ) ORDER BY a.\"order\"
                )
                FROM answers a
                WHERE a.question_id = q.id
            ),
            '[]'::json
        )
    ) ORDER BY c.name, ka.name, q.question_id, q.id
)
FROM questions q
LEFT JOIN certifications c ON q.certification_id = c.id
LEFT JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id;
"

# Export to JSON file
$PSQL_CMD -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "$SQL_QUERY" > "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    # Count exported questions (parse JSON array)
    if command -v jq &> /dev/null; then
        QUESTION_COUNT=$(jq 'length' "$OUTPUT_FILE" 2>/dev/null || echo "0")
    else
        # Fallback: count JSON objects manually
        QUESTION_COUNT=$(grep -o '"id"' "$OUTPUT_FILE" | wc -l | tr -d ' ')
    fi
    
    echo ""
    echo "✅ Export complete!"
    echo ""
    echo "📊 Statistics:"
    echo "   Questions exported: $QUESTION_COUNT"
    echo "   Output file: $OUTPUT_FILE"
    echo "   File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "📁 File location:"
    echo "   $(pwd)/$OUTPUT_FILE"
    echo ""
    echo "💡 The file contains all questions with their answers in JSON format."
    echo "   You can view it with: cat $OUTPUT_FILE | jq"
else
    echo ""
    echo "❌ Export failed!"
    exit 1
fi
