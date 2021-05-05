import qiniu from 'qiniu';
import cuid from 'cuid';
import Configs from '../../configs';
import path from 'path';

const accessKey = Configs.qiniu_ak;
const secretKey = Configs.qiniu_sk;
const putOptions = {
  scope: 'snapod-cloud',
};
const putPolicy = new qiniu.rs.PutPolicy(putOptions);

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

const uploadFileToCDN = async (filepath: string) => {
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

export default uploadFileToCDN;
