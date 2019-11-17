# Integration tests


To run the tests locally, just run the docker file with the command below. this returns the same exit code as the container, making it perfect for continuous integration. 
```bash
# from the root directory
cd ../ 
docker-compose -f docker-compose-tests.yml up --build --abort-on-container-exit
```

## Developing locally

The easiest way to 
```bash
# from the root directory
cd ../
docker-compose up -d

cd integration-tests
npm install
npm run test
```

## Priorities
Integration testing is way behind the app. Priorities are...

* Cluster creation fetching
* Topic creation