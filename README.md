# dyno_webapp


    cd dynophores_webapp

## activate conda 
    conda source activate dynophores_webapp

# Development mode 

## start sever
    cd server
    python run.py

Check in browser `http://localhost:3000/`
Example API: `/api/v1/example/greeting`


## start client
    cd client
    npm install
    npm run start

Check in browser `http://localhost:4200/`

## NGL library
We are using https://github.com/nglviewer/ngl 

# Production mode (frontend production)

1. build client
Client application is in `client\dist`-folder
    cd client
    npm install
    npm run build

2. build server
    cd server
    python run.py

3. go to `0.0.0.0:3000`


# TODO 
1) `script ngl` is hardcode in header, wait for update https://github.com/nglviewer/ngl