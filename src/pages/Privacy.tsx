import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.location.replace('/privacy.html');
  }, []);

  return null;
};

export default Privacy;
