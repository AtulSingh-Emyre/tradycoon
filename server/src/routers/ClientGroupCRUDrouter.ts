import {Router, Response, Request} from 'express';
import {ClientGroupController} from '../controllers/ClientGroupController';
import {AuthSetup} from '../middlewares/authentication-setup';

//@Route: /client-group-management
//@AUTH required
//@FUNCTIONS crud operations of the client groups

class ClientGroupCRUDRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }
  getRoutes() {}
  postRoutes() {
    this.router.post(
      '/analyst/client-groups',
      AuthSetup.isAuthenticated,
      ClientGroupController.groupDetails,
    );
    this.router.post(
      '/analyst/client-group-user-details',
      AuthSetup.isAuthenticated,
      ClientGroupController.clientDetailsByGroup,
    );

    this.router.post(
      '/analyst/add-user-to-group',
      // AuthSetup.isAuthenticated,
      ClientGroupController.addClient,
    );

    this.router.post(
      '/analyst/add-group',
      AuthSetup.isAuthenticated,
      ClientGroupController.addGroup,
    );

    //this.router.post('/group-data/purge', ClientGroupController.purge);
  }
  putRoutes() {
    this.router.put(
      '/analyst/group-rename',
      AuthSetup.isAuthenticated,
      ClientGroupController.renameGroups,
    );
    this.router.post(
      '/analyst/group/update-client',
      AuthSetup.isAuthenticated,
      ClientGroupController.updateClient,
    );
  }
  deleteRoutes() {
    this.router.put(
      '/analyst/remove-group',
      AuthSetup.isAuthenticated,
      ClientGroupController.deleteGroup,
    );
    this.router.put(
      '/analyst/group/remove-user',
      AuthSetup.isAuthenticated,
      ClientGroupController.deleteClient,
    );

    //  this.router.delete('/user/all', ClientGroupController.purge);
  }
}

export default new ClientGroupCRUDRouter().router;
