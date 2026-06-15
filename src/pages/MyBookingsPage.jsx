import { useOutletContext } from 'react-router-dom';
import { MyBookingsPage as MyBookingsPageContent } from '../components/MyBookingsPage';

export const MyBookingsPage = () => {
  const { showToast } = useOutletContext();

  return <MyBookingsPageContent showToast={showToast} />;
};
