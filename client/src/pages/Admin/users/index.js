import { React } from 'react';
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    ReferenceArrayField,
    Show,
    SimpleShowLayout,
    Edit,
    Filter,
    TextInput,
    ReferenceField, DateField
} from 'admin-on-rest';
import BlockButton from "./block";

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Tìm kiếm" source="q" alwaysOn/>
    </Filter>
);

export const UserList = (props) => {
    return (
        <List {...props} filters={<UserFilter/>}>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="username" />
                <TextField source="email" />
                <TextField source="displayname" label="Tên"/>
                <EditButton label="Xem"/>
                <BlockButton/>
            </Datagrid>
        </List>
    );
}

export const UserShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="username"/>
            <TextField source="displayname" label="Họ tên"/>
            <TextField source="email"/>
            <TextField source="cup"/>
            <TextField source="total_match" label="Tổng số trận"/>
            <TextField source="win_match" label="Số trận thắng"/>
            <TextField source="win_percent" label="Tỷ lệ thắng"/>
        </SimpleShowLayout>
    </Show>
)

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="username"/>
            <TextField source="displayname" label="Họ tên"/>
            <TextField source="email"/>
            <TextField source="cup"/>
            <TextField source="total_match" label="Tổng số trận"/>
            <TextField source="win_match" label="Số trận thắng"/>
            <TextField source="win_percent" label="Tỷ lệ thắng"/>
            <ReferenceArrayField label="Các trận đã chơi" reference="matches" source="idMatches">
                <Datagrid>
                    <ReferenceField label="Chủ phòng" source="id_user1" reference="users">
                        <TextField source="displayname"/>
                    </ReferenceField>
                    <ReferenceField label="Người chơi" source="id_user2" reference="users">
                        <TextField source="displayname"/>
                    </ReferenceField>
                    <ReferenceField label="Người thắng" source="win" reference="users">
                        <TextField source="displayname"/>
                    </ReferenceField>
                    <DateField label="Thời gian" source="createdAt" showTime/>
                    <EditButton label="Xem"/>
                </Datagrid>
            </ReferenceArrayField>
        </SimpleShowLayout>
    </Edit>
)
