#!/bin/bash

# Wait for MinIO to be ready
sleep 3

# Configure MinIO client
mc alias set myminio ${S3_ENDPOINT} ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY}

# Check if bucket exists and create if it doesn't
if ! mc ls myminio/${DEV_S3_BUCKET} > /dev/null 2>&1; then
    echo "Creating bucket ${DEV_S3_BUCKET}"
    mc mb myminio/${DEV_S3_BUCKET}
    
    # Uncomment below line to allow anonymous put
    # mc anonymous set upload myminio/${DEV_S3_BUCKET}

    # Uncomment below line to allow anonymous get
    # mc anonymous set download myminio/${DEV_S3_BUCKET}

    # Uncomment below line to allow anonymous get and put
    # mc anonymous set public myminio/${DEV_S3_BUCKET}
else
    echo "Bucket ${DEV_S3_BUCKET} already exists"
fi

# # Run any additional initialization scripts
# if [ -d "/minio-init" ]; then
#     for script in /minio-init/*.sh; do
#         if [ -f "$script" ]; then
#             echo "Running initialization script: $script"
#             chmod +x "$script"
#             "$script"
#         fi
#     done
# fi