# Smart-Waste

Our vision is to create a connected and sustainable campus through an innovative smart waste management system. By outfitting trash and recycling bins with laser sensors and connectivity, we will build a network that provides real-time bin fill status and optimization of waste routes.

Our technology will increase collection efficiency, reducing emissions from hauling routes. The data gathered will provide insights to drive further waste minimization initiatives and zero waste goals.


# Links

|     Link for     | Link                              | 
|:-------------------|:----------------------------------|
|Weekly Meeting Notes| [link](https://docs.google.com/document/d/1GXyXUnTMKGIcYvyj-8aEd7spdDEeYQJQScLqdhkhCxc/edit?usp=sharing)   |
|Vision              | [link](https://docs.google.com/document/d/19BQFE9qavzx0fWWvS-5EhH40ZsDCvB0uqDrFN7ACtwo/edit?usp=sharing)   |
|Video               | [link](https://drive.google.//)   |
|Demo/Slides         | [link](https://drive.google.//)   |
|Additional          | [link](https://drive.google.//)   |
Video 

## Requirements
- Windows 10+ with PowerShell and Git
- macOS 12+ with Command Line tools

## Cloning Steps
```console
~$ git clone git@github.com:ucsb/CS190B-F23-SmartWaste-rbriggs.git
```

## Running IOT 
'python ultrasonic.py'

## Frontend-Backend
`cd frontend-backend`

For running locally without docker: 
- `uvicorn app.main:app --reload`
git

## Troubleshooting

1. If you get that ports are not avaliable (if you don't want to use another port): 
    1. `lsof -i :<PORTINUSE>`
    2. `kill -9 <PID>`

`
