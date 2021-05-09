# 5G Mobility Web Application

Angular application based on [Paper Dashboard Angular](https://www.creative-tim.com/product/paper-dashboard-angular)

## Running on your environment

**node.js** is required to run an _Angular_ application. The installation guide can be found [here](https://nodejs.org/en/).

When installing _node.js_, _npm_ should also be installed on the computer.
  
### Install dependencies

1. Clone the repository

2. Install the dependencies using ```npm install```


### How to run the Web Application

Within the project directory, run the following:

1. ``npm run start``

2. The application should be running at [http://localhost:4200](http://localhost:4200)

## _Docker_

A _Dockerfile_ file was prepared with the necessary information for the deploy of this _Angular_ application. A _Docker Compose_ file was also prepared to start the application based on the _Dockerfile_. To do this, perform the following:

1. ``docker-compose build``

2. ``docker-compose up -d``

3. The application should be running at [http://localhost](http://localhost)


