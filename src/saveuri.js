//detection
var DownloadAttributeSupport = (typeof document !== 'undefined') && ('download' in document.createElement('a'));

export default function saveUri(url, name){
  if (DownloadAttributeSupport) {
    var dl = document.createElement('a');
    dl.setAttribute('href', url);
    dl.setAttribute('download', name);
    dl.click();
		return true;
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', '');
		return true;
	}
  return false;
}
