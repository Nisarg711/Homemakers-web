FROM node

ENV DATABASE_URL="postgresql://neondb_owner:npg_QL92OoIsUjZr@ep-restless-credit-aqkp2g3d-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" \
    AUTH_SECRET="FiTlXnrRHBt42ZF7n3oMS/ZoCSe6YnFeq/1AI5U55Ec=" \
    NEXTAUTH_URL="http://localhost:3000"

RUN mkdir homemakers

COPY . /homemakers
CMD [ "npm","run","dev"]