# azure-batch-functions
Nodejs project working with Docker and [Azure Batch](https://azure.microsoft.com/en-us/services/batch/).

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
To learn about [testing and debuging Azure functions locally read the docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local).  To get started with this project:

1. Install azure functions runtime ```npm i -g azure-functions-core-tools```
2. Clone the repo and cd into the folder
3. Run ```npm install```
4. Run ```npm test``` to run unit tests
5. Update rename  ```example.settings.json``` to ```local.settings.json```
6. Upload [docker_install_start_task.sh](docker/docker_install_start_task.sh) to a storage account.
7. Update settings in ```local.settings.json```:

    - get your batch keys by running ```az batch account keys list -g dockerworkshop -n workshopbatch```
    - get the storage account key

        ![get your storage keys in azure portal](/Assets/storage-keys-howto.png)

### Test function
The following command will start the function host process in separate terminal and call the function ```GetPoolInfo``` passing the json object as body to request.  For any of the other functions replace the name (some don't need the sample data as well). 

```
func run GetPoolInfo -f GetPoolInfo/sample.dat
```

#### Add a new function

```
func new --language JavaScript --template HttpTrigger --name NameOfFunction
```

## Other info
Find the docs for the node.js library at http://azure.github.io/azure-sdk-for-node/azure-batch/latest/

Azure Batch has a useful (if early release) of a cross platform Batch view at https://github.com/Azure/BatchLabs.  As the project is very young there are a few missing features and you have to build the project yourself.
