import { createConversationRoute } from './createConversationRoute';
import { getAllUsersRoute } from './getAllUsersRoute';
import { getUserConversationsRoute } from './getUserConversationsRoute';


export { protectRouteMiddleware } from './protectRouteMiddleware';
export const routes = [ 
    createConversationRoute,
    getAllUsersRoute,
    getUserConversationsRoute,    
];