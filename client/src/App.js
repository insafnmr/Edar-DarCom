import './templateStyle/style.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import HouseDetails from "./pages/HouseDetails";
import NavBar from './components/NavBar';
import HousesHost from './pages/HousesHost';
import Footer from './components/Footer';
import Houses from './components/Houses';
import AdminScreen from "./pages/AdminScreen";
import Contact from "./pages/Contact";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Contacts from "./pages/Contacts";
import Reservations from "./pages/Reservations";
import ReservationProcess from "./components/ReservationProcess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ActivateAccount from "./pages/ActivateAccount";
import Chat from "./pages/Chat";

function App() {

return (
  <Router>
    <div className="App container-top">
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/user/activate/:activation_token" component={ActivateAccount} />
        <Route exact path="/forgot_password" component={ForgotPassword} />
        <Route exact path="/user/reset/:token" component={ResetPassword} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path='/profile' component={Profile} />
        <Route exact path='/housedetails/:id' component={HouseDetails} />
        <Route exact path='/houses' component={Houses} />
        <Route exact path='/houseshost' component={HousesHost} />
        <Route exact path="/admin" component={AdminScreen} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/reports" component={Reports} />
        <Route exact path="/contacts" component={Contacts} />
        <Route exact path="/reservation/:id" component={ReservationProcess} />
        <Route exact path="/reservations" component={Reservations} />
        <Route exact path="/chat" component={Chat} />
      </Switch>
      <Footer />
    </div>

  </Router>
);
}

export default App;
