import AppLayout from '@/components/appLayout';
import 'react-native-reanimated';
import { Provider } from "react-redux";
import { store } from "../redux/store";


export default function RootLayout() {

  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}
