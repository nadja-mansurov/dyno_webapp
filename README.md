# dyno_webapp


    cd dynophores_webapp

## activate conda 
    conda source activate dynophores_webapp

# Development mode 

## start sever
    cd server
    flask run -p 3000

Check in browser `http://localhost:3000/`

## start client
    cd client
    npm install
    npm run serve

Check in browser `http://localhost:8080/`

## NGL library
We are using https://github.com/nglviewer/ngl 

# Production mode

## build client
    cd client
    npm install
    npm run build