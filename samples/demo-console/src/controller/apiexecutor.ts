/*
 * Copyright 2022 Sony Semiconductor Solutions Corp. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Client, Config, DeployDeviceAppStatus, DeployByConfigurationStatus, Logger, PublishModelStatus,  } from 'consoleaccesslibrary';

import yaml = require('js-yaml');
import * as fs from 'fs';

/**
 * Class for Execute Console Access Library API
 */
export class APIExecutor {

    prevPublishCallbackStatus;

    constructor() {
    }


    deployCallback=(deployStatusArray)=>{
        /** 
         * Callback for deploy status
         */
        console.log('************Callback for deploy status*****************');
        deployStatusArray.forEach((deployStatusItem)=> {
            const deployDeviceId= Object.keys(deployStatusItem)[0]
            const status= deployStatusItem[deployDeviceId]["status"];
            if (status == DeployByConfigurationStatus.DEPLOYING)
                console.log("Deployment In Progress - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.SUCCESSFUL)
                console.log("Deployment Completed - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.FAILED)
                console.log("Deployment Failed - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.CANCELED)
                console.log("Deployment Canceled - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.DEVICEAPP_UNDEPLOY)
                console.log("Device app undeploy - ", deployDeviceId)
            else{
                console.log(deployDeviceId, "Error - ", deployDeviceId)
            }
        })
    }

    publishCallback = (status: any)=>{
        /** 
         * Callback for publish model status
         */
        console.log('************Callback for publish model status*****************');
        if (status != this.prevPublishCallbackStatus){
            if (status == PublishModelStatus.BEFORE_CONVERSION)
                console.log("Before Conversion");
            else if (status == PublishModelStatus.CONVERTING)
                console.log("Converting");
            else if (status == PublishModelStatus.CONVERSION_FAILED)
                console.log("Conversion Failed");
            else if (status == PublishModelStatus.CONVERSION_COMPLETE)
                console.log("Conversion Completed");
            else if (status == PublishModelStatus.ADDING_TO_CONFIGURATION)
                console.log("Add To Configuration");
            else if (status == PublishModelStatus.ADD_TO_CONFIGURATION_FAILED)
                console.log("Add To Configuration Failed");
            else if (status == PublishModelStatus.ADD_TO_CONFIGURATION_COMPLETE)
                console.log("Add To Configuration Completed");
            else if (status == PublishModelStatus.SAVING)
                console.log("Saving");
            else{
                console.log("Error")
            }
            this.prevPublishCallbackStatus = status
        } else{
            console.log(".");
        }
    }

    deployDeviceAppCallback = (deployStatusArray)=>{
        /** 
         * Callback for Deploy Device App status
         */
        console.log('************Callback for Deploy Device App status*****************');

        deployStatusArray.forEach((deployStatusItem)=> {
            const deployDeviceId= Object.keys(deployStatusItem)[0];
            const status= deployStatusItem[deployDeviceId]["status"];
            if (status == DeployDeviceAppStatus.DEPLOYING)
                console.log("Deployment In Progress - ", deployDeviceId)
            else if (status == DeployDeviceAppStatus.DEPLOYMENT_DONE)
                console.log("Deployment Completed - ", deployDeviceId)
            else if (status == DeployDeviceAppStatus.DEPLOYMENT_FAILED)
                console.log("Deployment Failed - ", deployDeviceId)
            else if (status == DeployDeviceAppStatus.DEPLOYMENT_CANCELED)
                console.log("Deployment Canceled - ", deployDeviceId)
            else{
                console.log("Error - ", deployDeviceId)
            }
        })
    }

    async excecute() {
        try{
            fs.promises.lstat("./demo_config.yaml").then( async stats => {
                if(stats.isSymbolicLink()) {
                    Logger.info('The path to configuration file is a symbolic link');
                    process.exit();
                }
                else {
                    // Read the Configurations
                    const demoConfigDataSchema = yaml.load(fs.readFileSync('./demo_config.yaml', {encoding:'utf8', flag:'r'}));
                    const demoConfigurations = demoConfigDataSchema["demo_configuration"];

                    fs.promises.lstat("./console_access_settings.yaml").then( async stats => {
                        if(stats.isSymbolicLink()) {
                            Logger.info('The path to configuration file is a symbolic link');
                            process.exit();
                        }
                        else {
                            // Read the Console Access Settings
                            const consoleAccessSettingData  = yaml.load(fs.readFileSync('./console_access_settings.yaml', {encoding:'utf8', flag:'r'}));
                            const consoleAccessSettings = consoleAccessSettingData["console_access_settings"];

                            const { console_endpoint, portal_authorization_endpoint , client_secret, client_id} = consoleAccessSettings;

                            const {
                                device_id:deviceId,
                                number_of_images: numberOfImages,
                                skip,
                                sub_directory_name: subDirectoryName,
                                number_of_inference_results: numberOfInferenceResults,
                                filter,
                                raw,
                                time,
                                converted,
                                vendor_name: vendorName,
                                get_images_order_by: getImagesOrderBy,
                                get_last_inference_and_image_data_order_by: getLastInferenceAndImageDataOrderBy,
                                key,
                                version_number: versionNumber,
                                model,
                                model_id: modelId,
                                file_content: fileContent,
                                compiled_flg: compiledFlg,
                                file_name: fileName,
                                comment,
                                latest_type: latestType,
                                project_name: projectName,
                                model_platform: modelPlatform,
                                project_type: projectType,
                                app_name: appName,
                                from_datetime: fromDatetime,
                                to_datetime: toDatetime,
                                file_format: fileFormat,
                                entry_point: entryPoint,
                                device_name: deviceName, 
                                connection_state: connectionState, 
                                device_group_id: deviceGroupId,
                                config_id: configId,
                                deploy_parameter: deployParameter = undefined,
                                replace_model_id: replaceModelId,
                                deploy_id: deployId,
                                device_ids: deviceIds,
                                timeout,
                                input_format_param: input_format_param,
                                network_config: network_config,
                                network_type: network_type,
                                labels: labels,
                                sensor_loader_version_number: sensorLoaderVersionNumber,
                                sensor_version_number:  sensorVersionNumber,
                                model_version_number: modelVersionNumber,
                                ap_fw_version_number:  apFwVersionNumber
                            } = demoConfigurations

                            // Create instance of Client
                            const config = new Config(console_endpoint, portal_authorization_endpoint, client_id, client_secret); 
                            var client = await Client.createInstance(config);
                        
                            let response; 
                            
                            try {
                            
                                response = await client?.deviceManagement?.getDevices(deviceId, deviceName, connectionState, deviceGroupId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                
                                console.log("GetDevices response: "+response);

                            } catch (e) {
                                console.log("GetDevices Exception: "+e);
                            }

                            //DeviceManagement - startUploadInferenceResult
                            try {
                                response = await client?.deviceManagement?.startUploadInferenceResult(deviceId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                
                                console.log("StartUploadInferenceResult response: "+ response);
                                
                            } catch (e) {
                                console.log("StartUploadInferenceResult Exception: "+ e);
                            }


                            //DeviceManagement - stopUploadInferenceResult
                            try {
                                response = await client?.deviceManagement?.stopUploadInferenceResult(deviceId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }            
                                console.log("StopUploadInferenceResult response: "+ response);
                            } catch (e) {
                                console.log("StopUploadInferenceResult Exception: "+ e);
                            }


                            //DeviceManagement - getCommandParameterFile
                            try {
                                response = await client?.deviceManagement?.getCommandParameterFile();
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }           
                                console.log("GetCommandParameterFile response: "+ response);
                            } catch (e) {
                                console.log("GetCommandParameterFile Exception: "+ e);
                            }

                            //Insight - getImageDirectories
                            try {
                                response = await client?.insight?.getImageDirectories(deviceId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }           
                                console.log("GetImageDirectories response: "+ response);
                            } catch (e) {
                                console.log("GetImageDirectories Exception: "+ e);
                            }


                            //Insight - getImages
                            try {
                                response = await client?.insight?.getImages(deviceId, subDirectoryName, numberOfImages, skip, getImagesOrderBy);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }           
                                console.log("GetImages response: "+ response);
                            } catch (e) {
                                console.log("GetImages Exception: "+ e);
                            }

                            //Insight - getInferenceresults
                            try {
                                response = await client?.insight?.getInferenceResults(deviceId, filter, numberOfInferenceResults, raw, time);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetInferenceResults response: "+ response);
                            } catch (e) {
                                console.log("GetInferenceResults Exception: "+ e);
                            }

                            // P2 apis calling sample   
         

                            //Deployment - getDeviceApps
                            try {
                                response = await client?.deployment?.getDeviceApps();
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetDeviceApps response: ", response);

                            } catch (e) {
                                console.log("GetDeviceApps Exception: ", e);
                            }


                            //Deployment - importDeviceApp
                            try {
                                response = await client?.deployment?.importDeviceApp(compiledFlg, appName, versionNumber, fileName, fileContent, entryPoint, comment);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("ImportDeviceApp response: ", response);
                            } catch (e) {
                                console.log("ImportDeviceApp Exception: ", e);
                            }

                            //Deployment - DeleteDeviceApp
                            try {
                                response = await client?.deployment?.deleteDeviceApp(appName, versionNumber);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("DeleteDeviceApp response: ", response);
                            } catch (e) {
                                console.log("DeleteDeviceApp Exception: ", e);
                            }


                            //AIModel - GetModels
                            try {
                                response = await client?.aiModel?.getModels(modelId, comment, projectName, modelPlatform, projectType, deviceId, latestType);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetModels response: ", response);
                            } catch (e) {
                                console.log("GetModels Exception: ", e);
                            }
                        
                            //AIModel - ImportBaseModel
                            try {
                                response = await client?.aiModel?.importBaseModel(modelId, model);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }                                
                                console.log("ImportBaseModel response: ", response);
                            } catch (e) {
                                console.log("ImportBaseModel Exception: ", e);
                            }


                            //AIModel - GetBaseModelStatus
                            try {
                                response = await client?.aiModel?.getBaseModelStatus(modelId, latestType);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetBaseModelStatus response: ", response);
                            } catch (e) {
                                console.log("GetBaseModelStatus Exception: ", e);
                            }
                        
                            //AIModel - PublishModel
                            try {
                                response = await client?.aiModel?.publishModel(modelId, deviceId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }                                
                                console.log("PublishModel response: ", response);
                            } catch (e) {
                                console.log("PublishModel Exception: ", e);
                            }

                            //AIModel - publishModelWaitResponse
                            try {     
                                response = await client?.aiModel?.publishModelWaitResponse(modelId, deviceId, this.publishCallback);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }                                
                                console.log("PublishModel response: ", response);
                            } catch (e) {
                                console.log("PublishModel Exception: ", e);
                            }

                            //AIModel - DeleteModel
                            try {
                                response = await client?.aiModel?.deleteModel(modelId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("DeleteModel response: ", response);

                            } catch (e) {
                                console.log("DeleteModel Exception: ", e);
                            }

                            //Insight - GetImageData
                            try {
                                response = await client?.insight?.getImageData(deviceId, subDirectoryName, numberOfImages, skip, getLastInferenceAndImageDataOrderBy);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }                                
                                console.log("GetImageData response: "+ response);
                            } catch (e) {
                                console.log("GetImageData Exception: "+ e);
                            }

                            //Insight - GetLastInferenceData
                            try {
                                response = await client?.insight?.getLastInferenceData(deviceId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }                                
                                console.log("GetLastInferenceData response: "+ response);
                            } catch (e) {
                                console.log("GetLastInferenceData Exception: "+ e);
                            }

                            // Insight - GetLastInferenceAndImageData
                            try {
                                response = await client?.insight?.getLastInferenceAndImageData(deviceId, subDirectoryName);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetLastInferenceAndImageData response: "+ response);
                            } catch (e) {
                                console.log("GetLastInferenceAndImageData Exception: "+ e);
                            }
                            try {
                                response = await client?.deployment?.getDeployConfigurations();
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetDeployConfigurations response: "+ response);
                            } catch (e) {
                                console.log("GetDeployConfigurations Exception: "+ e);
                            }

                            //Deployment - GetDeployHistory
                            try {
                                response = await client?.deployment?.getDeployHistory(deviceId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetDeployHistory response: ", response);
                            } catch (e) {
                                console.log("GetDeployHistory Exception: ", e);
                            }
                        
                            //Deployment - GetDeviceAppDeploys
                            try {
                                response = await client?.deployment?.getDeviceAppDeploys(appName, versionNumber);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("GetDeviceAppDeploys response: ", response);
                            } catch (e) {
                                console.log("GetDeviceAppDeploys Exception: ", e);
                            }

                            //Deployment - CreateDeployConfiguration
                            try {
                                response = await client?.deployment?.createDeployConfiguration(configId, comment, sensorLoaderVersionNumber, sensorVersionNumber, modelId, modelVersionNumber, apFwVersionNumber);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("CreateDeployConfiguration response: ", response);

                            } catch (e) {
                                console.log("CreateDeployConfiguration Exception: ", e);
                            }

                            //Deployment - DeployDeviceApp
                            try {
                                response = await client?.deployment?.deployDeviceApp(appName, versionNumber, deviceIds, deployParameter, comment);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("DeployDeviceApp response: ", response);
                            } catch (e) {
                                console.log("DeployDeviceApp Exception: ", e);
                            }

                            //Deployment - DeployDeviceAppWaitResponse
                            try {

                                response = await client?.deployment?.deployDeviceAppWaitResponse(appName, versionNumber, deviceIds, deployParameter, comment, this.deployDeviceAppCallback);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("DeployDeviceAppWaitResponse response: ", response);

                            } catch (e) {
                                console.log("DeployDeviceAppWaitResponse Exception: ", e);
                            }

                            // Deployment - DeployByConfiguration
                            try {
                                response = await client?.deployment?.deployByConfiguration(configId, deviceIds, replaceModelId, comment);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("DeployByConfiguration response: ", response);

                            } catch (e) {
                                console.log("DeployByConfiguration Exception: ", e);
                            }

                            // Deployment - CancelDeployment
                            try {
                                response = await client?.deployment?.cancelDeployment(deviceId, deployId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("CancelDeployment response: ", response);

                            } catch (e) {
                                console.log("CancelDeployment Exception: ", e);
                            }

                            //Deployment - DeployByConfigurationWaitResponse
                            try {
                    
                                response = await client?.deployment?.deployByConfigurationWaitResponse(configId, deviceIds, replaceModelId, comment, timeout, this.deployCallback );
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("DeployByConfigurationWaitResponse response: ", response);

                            } catch (e) {
                                console.log("DeployByConfigurationWaitResponse Exception: ", e);
                            }

                            //Deployment - deleteDeployConfiguration
                            try {
                                response = await client?.deployment?.deleteDeployConfiguration(configId);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("DeleteDeployConfiguration response: ", response);

                            } catch (e) {
                                console.log("DeleteDeployConfiguration Exception: ", e);
                            }

                            
                            // Deployment - undeployDeviceApp
                            try {
                                response = await client?.deployment?.undeployDeviceApp(deviceIds);
                                console.log('************************************************************************');
                                console.log('************************************************************************');
                                if('data' in response){
                                    response= JSON.stringify(response.data);  
                                } else{
                                    response= JSON.stringify(response)
                                }
                                console.log("UndeployDeviceApp response: ", response);

                            } catch (e) {
                                console.log("UndeployDeviceApp Exception: ", e);
                            }

                        }
                    })
                }
            });

        } catch(e) {
        console.log("Exception: "+ e);
        }
        console.log("All API's executions completed!!!");
   }

}
