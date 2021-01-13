import {Admin, jsonServerRestClient, fetchUtils, Resource} from "admin-on-rest";
import {UserList, UserShow, UserEdit} from "./users";
import {MatchList, MatchEdit} from './matches'
import auth from './auth';
import PeopleIcon from "@material-ui/icons/People";

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
}

export default (props) => (
    <Admin restClient={jsonServerRestClient('http://localhost:8000/admin', httpClient)} authClient={auth}>
        <Resource name="users" list={UserList} show={UserShow} edit={UserEdit} icon={PeopleIcon}/>
        <Resource name='matches' list={MatchList} edit={MatchEdit}/>
    </Admin>
);