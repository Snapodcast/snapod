import qiniu from 'qiniu';
import cuid from 'cuid';
import Configs from '../../configs';
import path from 'path';

const { qiniu_ak: accessKey, qiniu_sk: secretKey } = Configs;
const putOptions = {
  scope: 'snapod-cloud',
};
const putPolicy = new qiniu.rs.PutPolicy(putOptions);

/**
 * Qiniu uploader (by buffer)
 *
 * @param {File} file
 * @return {string} remote file url
 */
export const uploadFile = async (file: File) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const uploadToken = putPolicy.uploadToken(mac);

  const config: any = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  config.useHttpsDomain = true;
  config.useCdnDomain = true;

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  const key = `${cuid()}${file.name}`;

  formUploader.putFile(uploadToken, key, file.path, putExtra, (respErr) => {
    if (respErr) {
      throw respErr;
    }
  });

  return `${Configs.qiniu_url}/${key}`;
};

/**
 * Qiniu uploader (by filepath)
 *
 * @param {string} filepath
 * @return {string} remote file url
 */
const uploadFilepath = async (filepath: string) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const uploadToken = putPolicy.uploadToken(mac);

  const config: any = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  config.useHttpsDomain = true;
  config.useCdnDomain = true;

  const localFile = filepath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  const key = `${cuid()}${path.extname(filepath)}`;

  formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr) => {
    if (respErr) {
      throw respErr;
    }
  });

  return `${Configs.qiniu_url}/${key}`;
};

export default uploadFilepath;
