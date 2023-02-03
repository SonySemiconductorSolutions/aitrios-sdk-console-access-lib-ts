/*
 * Copyright 2022 Sony Semiconductor Solutions Corp. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 // Schema definitions for demo configurations

export interface DemoConfigDataSchema {
    demo_configuration: DemoConfigurationSchema;
}

export interface DemoConfigurationSchema {
    device_id: string;
    number_of_images: number;
    skip: number;
    sub_directory_name: string;
    number_of_inference_results: number;
    filter: string;
    raw: number;
    time: string;
    get_images_order_by: string;
    get_last_inference_and_image_data_order_by: string;
    app_name: string;
    version_number: string;
    model: string;
    model_id: string;
    get_model_id: string,
    device_id_for_get_model: string,
    file_content: string;
    compiled_flg: string;
    file_name: string;
    comment: string;
    project_name: string;
    model_platform: string;
    project_type: string;
    entry_point: string;
    device_name: string;
    connection_state: string;
    device_group_id: string;
    latest_type: string;
    config_id: string;
    deploy_parameter: string;
    deploy_id: string;
    replace_model_id: string;
    timeout: number;
    converted: string;
    vendor_name: string;
    key: string;
    from_datetime: string;
    to_datetime: string;
    file_format: string;
    device_ids: string;
    input_format_param: string;
    network_config: string;
    network_type: string;
    labels: string;
    sensor_loader_version_number: string;
    sensor_version_number:  string;
    model_version_number: string;
    ap_fw_version_number:  string;
}

// Schema definitions for console access settings
export interface ConsoleAccessSettingDataSchema {
    console_access_settings: ConsoleAccessSettingsSchema;
}

export interface ConsoleAccessSettingsSchema {
    console_endpoint: string;
    portal_authorization_endpoint: string;
    client_secret: string;
    client_id: string;
}
