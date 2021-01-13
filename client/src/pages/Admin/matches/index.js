import { React } from 'react';
import { List, Datagrid, TextField, EditButton, ReferenceArrayField, DateField, Show, SimpleShowLayout, Edit, Filter, TextInput, ReferenceField  } from 'admin-on-rest';
import MessagesList from "./messages";

export const MatchList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField label="Tên phòng" source="boardName"/>
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
        </List>
    );
}

// export const MatchShow = (props) => (
//     <Show {...props}>
//         <SimpleShowLayout>
//             <ReferenceField label="Chủ phòng" source="id_user1" reference="users">
//                 <TextField source="displayname"/>
//             </ReferenceField>
//             <ReferenceField label="Người chơi" source="id_user2" reference="users">
//                 <TextField source="displayname"/>
//             </ReferenceField>
//             <ReferenceField label="Người thắng" source="win" reference="users">
//                 <TextField source="displayname"/>
//             </ReferenceField>
//             <DateField label="Thời gian" source="createdAt" showTime/>
//         </SimpleShowLayout>
//     </Show>
// )

export const MatchEdit = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField label="Tên phòng" source="id_board.title"/>
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
            <TextField label="Miêu tả" source="id_board.description"/>
            <TextField label="Thời gian nước đi" source="id_board.time"/>
            <TextField label="Mật khẩu" source="id_board.password"/>
           <MessagesList source="messages"/>
        </SimpleShowLayout>
    </Show>
)