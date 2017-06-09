# azure-batch-functions

## Developing
To get started:

- Install azure functions runtime ```npm i -g azure-functions-core-tools```
- Clone the repo and cd into the folder
- Run ```npm install```

### Test function
The following command will start the function host process in separate terminal and call the function ```GetPoolInfo``` passing the json object as body to request.  For any of the other functions replace the name (some don't need the sample data as well). 

```
func run GetPoolInfo -f sample.dat
```

#### Add a new function

```
func new --language JavaScript --template HttpTrigger --name NameOfFunction
```
