# Smart-Waste

Meeting Notes [here](https://docs.google.com/document/d/1GXyXUnTMKGIcYvyj-8aEd7spdDEeYQJQScLqdhkhCxc/edit?usp=sharing)

Vision [here](https://docs.google.com/document/d/19BQFE9qavzx0fWWvS-5EhH40ZsDCvB0uqDrFN7ACtwo/edit?usp=sharing)

## Description

> backend 
> > main.py

> frontend

> iot-device
> > sensors
> > > ultrasonic.py

> > dockerfile \
> > http_client.py \
> > requirements.txt 

## Backend
`cd backend`

## Frontend
`cd frontend`

For running locally without docker: 
- `uvicorn app.main:app --reload`


## Troubleshooting

1. If you get that ports are not avaliable (if you don't want to use another port): 
    1. `lsof -i :5000`
    2. `kill -9 <PID>`

`
