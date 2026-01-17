#!/bin/bash
# Documentation Generation Script

echo "Generating documentation..."

# Generate Javadoc for backend
cd ../backend
mvn javadoc:javadoc

echo "Documentation generated!"
