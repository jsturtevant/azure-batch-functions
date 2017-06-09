# azure-batch-functions

## Developing

### Azure Batch
Get the [Azure Cli 2.0](https://docs.microsoft.com/en-us/cli/azure/overview) or use ```docker run -it azuresdk/azure-cli-python```.

Set you subscription:

```
az login #follow the instructions
az account list
az account set --subscription <YOUR SUB ID>.  
```

Create azure batch:

```
az group create --name azurebatchfunctionsrg --location eastus
az provider register -n Microsoft.Batch
az provider show -n Microsoft.Batch -o table #run a few times and wait until it says registered
az batch account create -l eastus -g azurebatchfunctionsrg -n myazurebatch
```

### Azure functions Component
To get started:

1. Install azure functions runtime ```npm i -g azure-functions-core-tools```
2. Clone the repo and cd into the folder
3.  Run ```npm install```
4. Update rename  ```example.settings.json``` to ```local.settings.json```
5. Update settings:
    
    - get your batch keys by running ```az batch account keys list -g dockerworkshop -n workshopbatch```

### Test function
The following command will start the function host process in separate terminal and call the function ```GetPoolInfo``` passing the json object as body to request.  For any of the other functions replace the name (some don't need the sample data as well). 

```
func run GetPoolInfo -f sample.dat
```

#### Add a new function

```
func new --language JavaScript --template HttpTrigger --name NameOfFunction
```
