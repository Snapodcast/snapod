import { remote, app } from 'electron';

export default function rootPath() {
  return (app || remote.app).getPath('userData');
}
