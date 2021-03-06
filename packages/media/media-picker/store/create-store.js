import * as tslib_1 from "tslib";
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { CloudService } from '../popup/services/cloud-service';
import { MediaApiFetcher } from '../popup/tools/fetcher/fetcher';
import { WsProvider } from '../popup/tools/websocket/wsProvider';
import reducers from '../popup/reducers/reducers';
import defaultState from '../popup/default_state';
import appConfig from '../config';
import changeAccount from '../popup/middleware/changeAccount';
import { changeService } from '../popup/middleware/changeService';
import { fetchNextCloudFilesPageMiddleware } from '../popup/middleware/fetchNextCloudFilesPage';
import { changeCloudAccountFolderMiddleware } from '../popup/middleware/changeCloudAccountFolder';
import startAppMiddleware from '../popup/middleware/startApp';
import { getConnectedRemoteAccounts } from '../popup/middleware/getConnectedRemoteAccounts';
import { getFilesInRecents } from '../popup/middleware/getFilesInRecents';
import { importFilesMiddleware } from '../popup/middleware/importFiles';
import { startCloudAccountOAuthFlow } from '../popup/middleware/startAuth';
import unlinkCloudAccount from '../popup/middleware/unlinkCloudAccount';
import { proxyUploadEvents } from '../popup/middleware/proxyUploadEvents';
import cancelUpload from '../popup/middleware/cancelUpload';
import { editRemoteImageMiddleware } from '../popup/middleware/editRemoteImage';
import finalizeUploadMiddleware from '../popup/middleware/finalizeUpload';
import getPreviewMiddleware from '../popup/middleware/getPreview';
import { handleCloudFetchingEvent } from '../popup/middleware/handleCloudFetchingEvent';
import searchGiphy from '../popup/middleware/searchGiphy';
import hidePopupMiddleware from '../popup/middleware/hidePopup';
import sendUploadEventMiddleware from '../popup/middleware/sendUploadEvent';
import analyticsProcessing from '../popup/middleware/analyticsProcessing';
import { removeFileFromRecents } from '../popup/middleware/removeFileFromRecents';
export default (function (eventEmitter, tenantContext, userContext, config) {
    var userAuthProvider = userContext.config.authProvider;
    var redirectUrl = appConfig.html.redirectUrl;
    var fetcher = new MediaApiFetcher();
    var wsProvider = new WsProvider();
    var cloudService = new CloudService(userAuthProvider);
    var partialState = tslib_1.__assign({}, defaultState, { redirectUrl: redirectUrl, tenantContext: tenantContext, userContext: userContext, config: config });
    return createStore(reducers, partialState, composeWithDevTools(applyMiddleware(analyticsProcessing, startAppMiddleware(), getFilesInRecents(), changeService, changeAccount, changeCloudAccountFolderMiddleware(fetcher), fetchNextCloudFilesPageMiddleware(fetcher), startCloudAccountOAuthFlow(fetcher, cloudService), unlinkCloudAccount(fetcher), getConnectedRemoteAccounts(fetcher), cancelUpload, importFilesMiddleware(eventEmitter, wsProvider), editRemoteImageMiddleware(), getPreviewMiddleware(), finalizeUploadMiddleware(fetcher), proxyUploadEvents, handleCloudFetchingEvent, searchGiphy(fetcher), hidePopupMiddleware(eventEmitter), sendUploadEventMiddleware(eventEmitter), removeFileFromRecents)));
});
//# sourceMappingURL=create-store.js.map