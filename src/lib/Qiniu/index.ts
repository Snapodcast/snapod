import qiniu from 'qiniu';
import cuid from 'cuid';
import Configs from '../../configs';
import path from 'path';

const uploadFileToCDN = async (filepath: string, setState: any) => {
  const accessKey = Configs.qiniu_ak;
  const secretKey = Configs.qiniu_sk;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  const putOptions = {
    scope: 'snapod-cloud',
  };
  const putPolicy = new qiniu.rs.PutPolicy(putOptions);
  const uploadToken = putPolicy.uploadToken(mac);

  const config: any = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  config.useHttpsDomain = true;
  config.useCdnDomain = true;

  const localFile = filepath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  const key = `${cuid()}${path.extname(filepath)}`;

  return formUploader.putFile(
    uploadToken,
    key,
    localFile,
    putExtra,
    (respErr) => {
      if (respErr) {
        throw respErr;
      }
      setState(`${Configs.qiniu_url}/${key}`);
    }
  );
};

export default uploadFileToCDN;