#!/bin/bash
awslocal s3 mb s3://cq-local-bucket
awslocal s3api put-bucket-acl --bucket cq-local-bucket --acl public-read