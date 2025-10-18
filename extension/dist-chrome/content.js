var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = "\n.wallet-connect[data-v-4f7ca26e] {\n  min-width: 400px;\n  max-width: 500px;\n}\n.connect-header[data-v-4f7ca26e] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n  padding-bottom: 16px;\n  border-bottom: 1px solid #e1e5e9;\n}\n.connect-header h3[data-v-4f7ca26e] {\n  margin: 0;\n  color: #333;\n  font-size: 18px;\n}\n.close-btn[data-v-4f7ca26e] {\n  background: none;\n  border: none;\n  font-size: 20px;\n  cursor: pointer;\n  color: #666;\n  padding: 4px;\n  border-radius: 4px;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-4f7ca26e]:hover {\n  background-color: #f0f0f0;\n}\n.step-content[data-v-4f7ca26e] {\n  margin-bottom: 24px;\n}\n.step-description[data-v-4f7ca26e] {\n  color: #666;\n  margin-bottom: 20px;\n  text-align: center;\n}\n.wallet-options[data-v-4f7ca26e] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.wallet-list[data-v-4f7ca26e] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.wallet-option[data-v-4f7ca26e] {\n  display: flex;\n  align-items: center;\n  padding: 16px;\n  border: 2px solid #e1e5e9;\n  border-radius: 8px;\n  background: white;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  position: relative;\n}\n.wallet-option[data-v-4f7ca26e]:hover:not(:disabled) {\n  border-color: #e6007a;\n  box-shadow: 0 2px 8px rgba(230, 0, 122, 0.1);\n}\n.wallet-option[data-v-4f7ca26e]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.wallet-icon[data-v-4f7ca26e] {\n  width: 32px;\n  height: 32px;\n  margin-right: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.wallet-icon img[data-v-4f7ca26e] {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.wallet-icon-fallback[data-v-4f7ca26e] {\n  font-size: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.wallet-info[data-v-4f7ca26e] {\n  flex: 1;\n}\n.wallet-name[data-v-4f7ca26e] {\n  font-weight: 600;\n  color: #333;\n  margin-bottom: 4px;\n}\n.wallet-description[data-v-4f7ca26e] {\n  font-size: 14px;\n  color: #666;\n}\n.loading-spinner[data-v-4f7ca26e] {\n  width: 20px;\n  height: 20px;\n  border: 2px solid #f3f3f3;\n  border-top: 2px solid #e6007a;\n  border-radius: 50%;\n  animation: spin-4f7ca26e 1s linear infinite;\n}\n@keyframes spin-4f7ca26e {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.extension-status[data-v-4f7ca26e] {\n  text-align: center;\n  padding: 16px;\n  border-radius: 8px;\n  background: #f8f9fa;\n  border: 1px solid #e1e5e9;\n}\n.status-checking[data-v-4f7ca26e] {\n  color: #0066cc;\n  font-weight: 500;\n}\n.status-not-found[data-v-4f7ca26e] {\n  color: #dc3545;\n  font-weight: 500;\n}\n.status-found[data-v-4f7ca26e] {\n  color: #28a745;\n  font-weight: 500;\n}\n.status-help[data-v-4f7ca26e] {\n  margin-top: 8px;\n  font-size: 14px;\n  color: #666;\n}\n.status-help a[data-v-4f7ca26e] {\n  color: #e6007a;\n  text-decoration: none;\n  font-weight: 500;\n}\n.status-help a[data-v-4f7ca26e]:hover {\n  text-decoration: underline;\n}\n.status-actions[data-v-4f7ca26e] {\n  display: flex;\n  gap: 12px;\n  margin-top: 16px;\n}\n.account-list[data-v-4f7ca26e] {\n  max-height: 300px;\n  overflow-y: auto;\n  border: 1px solid #e1e5e9;\n  border-radius: 8px;\n}\n.account-item[data-v-4f7ca26e] {\n  display: flex;\n  align-items: center;\n  padding: 16px;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  border-bottom: 1px solid #f0f0f0;\n}\n.account-item[data-v-4f7ca26e]:last-child {\n  border-bottom: none;\n}\n.account-item[data-v-4f7ca26e]:hover {\n  background-color: #f8f9fa;\n}\n.account-item.selected[data-v-4f7ca26e] {\n  background-color: #e8f4fd;\n  border-left: 3px solid #e6007a;\n}\n.account-avatar[data-v-4f7ca26e] {\n  width: 32px;\n  height: 32px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 12px;\n  margin-right: 12px;\n}\n.account-info[data-v-4f7ca26e] {\n  flex: 1;\n}\n.account-name[data-v-4f7ca26e] {\n  font-weight: 500;\n  color: #333;\n  margin-bottom: 2px;\n}\n.account-address[data-v-4f7ca26e] {\n  font-family: monospace;\n  font-size: 12px;\n  color: #666;\n}\n.account-check[data-v-4f7ca26e] {\n  color: #e6007a;\n  font-weight: bold;\n  font-size: 18px;\n}\n.sign-message[data-v-4f7ca26e] {\n  background: #f8f9fa;\n  border: 1px solid #e1e5e9;\n  border-radius: 8px;\n  padding: 16px;\n  margin-bottom: 20px;\n}\n.message-label[data-v-4f7ca26e] {\n  font-weight: 500;\n  color: #333;\n  margin-bottom: 8px;\n}\n.message-content[data-v-4f7ca26e] {\n  font-family: monospace;\n  font-size: 12px;\n  color: #666;\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n.step-actions[data-v-4f7ca26e] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.btn-primary[data-v-4f7ca26e], .btn-secondary[data-v-4f7ca26e] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-primary[data-v-4f7ca26e] {\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n}\n.btn-primary[data-v-4f7ca26e]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-primary[data-v-4f7ca26e]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-secondary[data-v-4f7ca26e] {\n  background: #6c757d;\n  color: white;\n}\n.btn-secondary[data-v-4f7ca26e]:hover {\n  background: #5a6268;\n}\n.error-message[data-v-4f7ca26e] {\n  text-align: left;\n  padding: 24px;\n  background: #fff5f5;\n  border: 1px solid #fed7d7;\n  border-radius: 8px;\n}\n.error-icon[data-v-4f7ca26e] {\n  font-size: 24px;\n  margin-bottom: 8px;\n  display: block;\n}\n.error-text[data-v-4f7ca26e] {\n  color: #c53030;\n  font-weight: 500;\n  white-space: pre-line;\n  line-height: 1.5;\n  margin-bottom: 16px;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n}\n.error-actions[data-v-4f7ca26e] {\n  display: flex;\n  justify-content: center;\n}\n.no-wallets[data-v-4f7ca26e] {\n  text-align: center;\n  padding: 24px;\n  color: #666;\n}\n.no-wallets-icon[data-v-4f7ca26e] {\n  font-size: 32px;\n  margin-bottom: 8px;\n}\n.no-wallets-text[data-v-4f7ca26e] {\n  font-size: 14px;\n}\n\n.modal-overlay[data-v-973fd79d] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.config-modal[data-v-973fd79d] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 90vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-973fd79d] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-973fd79d] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-973fd79d] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-973fd79d]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-973fd79d] {\n  padding: 24px;\n  flex: 1;\n  overflow-y: auto;\n}\n.config-sections[data-v-973fd79d] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.config-section[data-v-973fd79d] {\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  padding: 20px;\n}\n.config-section h4[data-v-973fd79d] {\n  margin: 0 0 16px 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #333;\n  border-bottom: 2px solid #e6007a;\n  padding-bottom: 8px;\n}\n.form-group[data-v-973fd79d] {\n  margin-bottom: 16px;\n}\n.form-group label[data-v-973fd79d] {\n  display: block;\n  margin-bottom: 6px;\n  font-weight: 500;\n  color: #555;\n}\n.form-input[data-v-973fd79d] {\n  width: 100%;\n  padding: 10px 12px;\n  border: 2px solid #e9ecef;\n  border-radius: 6px;\n  font-size: 14px;\n  transition: border-color 0.2s ease;\n}\n.form-input[data-v-973fd79d]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.number-input[data-v-973fd79d] {\n  max-width: 120px;\n}\n.input-help[data-v-973fd79d] {\n  margin-top: 6px;\n  font-size: 12px;\n  color: #666;\n  line-height: 1.4;\n}\n.agreement-preview[data-v-973fd79d] {\n  margin-top: 16px;\n  padding: 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n}\n.preview-label[data-v-973fd79d] {\n  font-size: 12px;\n  font-weight: 500;\n  color: #666;\n  margin-bottom: 8px;\n}\n.preview-bar[data-v-973fd79d] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.progress-bar[data-v-973fd79d] {\n  width: 100%;\n  height: 8px;\n  background: #e9ecef;\n  border-radius: 4px;\n  overflow: hidden;\n}\n.progress-fill[data-v-973fd79d] {\n  height: 100%;\n  background: linear-gradient(135deg, #28a745, #20c997);\n  transition: width 0.3s ease;\n}\n.progress-text[data-v-973fd79d] {\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n}\n.modal-actions[data-v-973fd79d] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-973fd79d] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-secondary[data-v-973fd79d] {\n  background: #f8f9fa;\n  color: #666;\n  border: 1px solid #dee2e6;\n}\n.btn-secondary[data-v-973fd79d]:hover {\n  background: #e9ecef;\n}\n.btn-primary[data-v-973fd79d] {\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n}\n.btn-primary[data-v-973fd79d]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #cc1177);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn[data-v-973fd79d]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.status-badge-container[data-v-875347a1] {\n  position: relative;\n  display: inline-block;\n}\n.status-badge[data-v-875347a1] {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  border: 1px solid rgba(255, 255, 255, 0.6);\n  transition: all 0.2s ease;\n  user-select: none;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);\n  backdrop-filter: blur(3px);\n  white-space: nowrap;\n  min-width: 80px;\n  justify-content: center;\n}\n.status-clickable[data-v-875347a1] {\n  cursor: pointer;\n}\n.status-clickable[data-v-875347a1]:hover {\n  transform: translateY(-2px) scale(1.02);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n  border-color: rgba(255, 255, 255, 1);\n}\n.status-icon[data-v-875347a1] {\n  font-size: 0.8rem;\n}\n.edit-icon[data-v-875347a1] {\n  font-size: 0.7rem;\n  opacity: 0.7;\n}\n\n/* Status color classes with enhanced floating design */\n.status-not-started[data-v-875347a1] { \n  background: linear-gradient(135deg, #6c757d, #5a6268); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-considering[data-v-875347a1] { \n  background: linear-gradient(135deg, #ffc107, #e0a800); \n  color: #212529; \n  border-color: rgba(33, 37, 41, 0.2);\n}\n.status-ready-for-approval[data-v-875347a1] { \n  background: linear-gradient(135deg, #17a2b8, #138496); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-waiting-for-agreement[data-v-875347a1] { \n  background: linear-gradient(135deg, #fd7e14, #e8680b); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-ready-to-vote[data-v-875347a1] { \n  background: linear-gradient(135deg, #28a745, #1e7e34); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-reconsidering[data-v-875347a1] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-voted-aye[data-v-875347a1] { \n  background: linear-gradient(135deg, #198754, #155724); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-voted-nay[data-v-875347a1] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-voted-abstain[data-v-875347a1] { \n  background: linear-gradient(135deg, #6f42c1, #5a32a3); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-not-voted[data-v-875347a1] { \n  background: linear-gradient(135deg, #e9ecef, #dee2e6); \n  color: #495057; \n  border-color: rgba(73, 80, 87, 0.2);\n}\n\n/* Modal styles */\n.modal-overlay[data-v-875347a1] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.status-modal[data-v-875347a1] {\n  background: white;\n  border-radius: 8px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-875347a1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e9ecef;\n}\n.modal-header h3[data-v-875347a1] {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n}\n.close-btn[data-v-875347a1] {\n  background: none;\n  border: none;\n  font-size: 1.5rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 30px;\n  height: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn[data-v-875347a1]:hover {\n  color: #495057;\n}\n.modal-content[data-v-875347a1] {\n  padding: 20px;\n}\n.modal-content p[data-v-875347a1] {\n  margin: 0 0 16px 0;\n  font-size: 0.9rem;\n}\n.status-options[data-v-875347a1] {\n  margin: 20px 0;\n}\n.status-options label[data-v-875347a1] {\n  display: block;\n  margin-bottom: 12px;\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.status-grid[data-v-875347a1] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 8px;\n}\n.status-option[data-v-875347a1] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 12px;\n  border: 2px solid #e9ecef;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  font-size: 0.8rem;\n}\n.status-option[data-v-875347a1]:hover {\n  border-color: #007bff;\n  background: #f8f9fa;\n}\n.status-option.selected[data-v-875347a1] {\n  border-color: #007bff;\n  background: #e7f3ff;\n}\n.option-icon[data-v-875347a1] {\n  font-size: 0.9rem;\n}\n.reason-section[data-v-875347a1] {\n  margin: 20px 0;\n}\n.reason-section label[data-v-875347a1] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.reason-section textarea[data-v-875347a1] {\n  width: 100%;\n  border: 1px solid #ced4da;\n  border-radius: 4px;\n  padding: 8px 12px;\n  font-size: 0.9rem;\n  resize: vertical;\n  min-height: 60px;\n}\n.reason-section textarea[data-v-875347a1]:focus {\n  outline: none;\n  border-color: #007bff;\n  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n.modal-actions[data-v-875347a1] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-875347a1] {\n  padding: 8px 16px;\n  border-radius: 4px;\n  border: none;\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-secondary[data-v-875347a1] {\n  background: #6c757d;\n  color: white;\n}\n.btn-secondary[data-v-875347a1]:hover {\n  background: #5a6268;\n}\n.btn-primary[data-v-875347a1] {\n  background: #007bff;\n  color: white;\n}\n.btn-primary[data-v-875347a1]:hover:not(:disabled) {\n  background: #0056b3;\n}\n.btn-primary[data-v-875347a1]:disabled {\n  background: #6c757d;\n  cursor: not-allowed;\n}\n\n.modal-overlay[data-v-db9e79d9] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.proposal-browser-modal[data-v-db9e79d9] {\n  background: white;\n  border-radius: 12px;\n  width: 95vw;\n  height: 90vh;\n  max-width: 1400px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n}\n.modal-header[data-v-db9e79d9] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: #f8f9fa;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h2[data-v-db9e79d9] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-db9e79d9] {\n  background: none;\n  border: none;\n  font-size: 2rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: all 0.2s ease;\n}\n.close-btn[data-v-db9e79d9]:hover {\n  background: #e9ecef;\n  color: #495057;\n}\n.browser-content[data-v-db9e79d9] {\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n}\n.filter-panel[data-v-db9e79d9] {\n  width: 280px;\n  background: #f8f9fa;\n  border-right: 1px solid #e9ecef;\n  padding: 20px;\n  overflow-y: auto;\n}\n.filter-section h3[data-v-db9e79d9] {\n  margin: 0 0 16px 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #333;\n}\n.filter-group[data-v-db9e79d9] {\n  margin-bottom: 16px;\n}\n.filter-group label[data-v-db9e79d9] {\n  display: block;\n  margin-bottom: 6px;\n  font-weight: 500;\n  font-size: 0.9rem;\n  color: #555;\n}\n.search-input[data-v-db9e79d9],\n.filter-select[data-v-db9e79d9] {\n  width: 100%;\n  padding: 8px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  background: white;\n}\n.search-input[data-v-db9e79d9]:focus,\n.filter-select[data-v-db9e79d9]:focus {\n  outline: none;\n  border-color: #007bff;\n  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n.clear-filters-btn[data-v-db9e79d9] {\n  width: 100%;\n  padding: 8px 16px;\n  background: #dc3545;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n.clear-filters-btn[data-v-db9e79d9]:hover {\n  background: #c82333;\n}\n.content-area[data-v-db9e79d9] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.view-controls[data-v-db9e79d9] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e9ecef;\n  background: white;\n}\n.view-modes[data-v-db9e79d9] {\n  display: flex;\n  gap: 8px;\n}\n.view-btn[data-v-db9e79d9] {\n  padding: 6px 12px;\n  border: 1px solid #ced4da;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.2s ease;\n}\n.view-btn.active[data-v-db9e79d9] {\n  background: #007bff;\n  color: white;\n  border-color: #007bff;\n}\n.sort-controls[data-v-db9e79d9] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.sort-select[data-v-db9e79d9] {\n  padding: 6px 10px;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  font-size: 0.9rem;\n}\n.sort-order-btn[data-v-db9e79d9] {\n  padding: 6px 10px;\n  border: 1px solid #ced4da;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n}\n.results-info[data-v-db9e79d9] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.proposals-container[data-v-db9e79d9] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 20px;\n}\n.loading-state[data-v-db9e79d9],\n.empty-state[data-v-db9e79d9] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 300px;\n  text-align: center;\n}\n.spinner[data-v-db9e79d9] {\n  width: 40px;\n  height: 40px;\n  border: 4px solid #f3f3f3;\n  border-top: 4px solid #007bff;\n  border-radius: 50%;\n  animation: spin-db9e79d9 1s linear infinite;\n}\n@keyframes spin-db9e79d9 {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.empty-icon[data-v-db9e79d9] {\n  font-size: 4rem;\n  margin-bottom: 16px;\n}\n.proposals-list[data-v-db9e79d9] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  background: #e9ecef;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.proposal-item[data-v-db9e79d9] {\n  display: grid;\n  grid-template-columns: 80px 1fr 200px 150px 120px;\n  gap: 16px;\n  padding: 16px 20px;\n  background: white;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  align-items: center;\n}\n.proposal-item[data-v-db9e79d9]:hover {\n  background: #f8f9fa;\n}\n.proposal-id[data-v-db9e79d9] {\n  font-weight: 600;\n  color: #007bff;\n}\n.proposal-title[data-v-db9e79d9] {\n  font-weight: 500;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.proposal-assignment[data-v-db9e79d9] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: #666;\n}\n.assign-btn[data-v-db9e79d9] {\n  padding: 4px 8px;\n  background: var(--assign-gradient);\n  color: white;\n  border: 1px solid var(--assign-border);\n  border-radius: 4px;\n  font-size: 0.8rem;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.assign-btn[data-v-db9e79d9]:hover {\n  background: var(--assign-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 2px 6px var(--assign-shadow);\n}\n.proposal-updated[data-v-db9e79d9] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.proposals-cards[data-v-db9e79d9] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 20px;\n}\n.proposal-card[data-v-db9e79d9] {\n  background: white;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  padding: 20px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-card[data-v-db9e79d9]:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n  transform: translateY(-2px);\n}\n.card-header[data-v-db9e79d9] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.card-title[data-v-db9e79d9] {\n  margin: 0 0 12px 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #333;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.card-meta[data-v-db9e79d9] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.meta-item[data-v-db9e79d9] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.pagination[data-v-db9e79d9] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n  margin-top: 20px;\n  padding: 20px;\n}\n.page-btn[data-v-db9e79d9] {\n  padding: 8px 16px;\n  border: 1px solid #ced4da;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.page-btn[data-v-db9e79d9]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.page-btn[data-v-db9e79d9]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.page-info[data-v-db9e79d9] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.modal-content[data-v-db9e79d9] {\n  max-height: 80vh;\n  overflow-y: auto;\n  padding: 20px;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n.proposal-list[data-v-db9e79d9] {\n  overflow-y: auto;\n  max-height: calc(80vh - 180px); /* Account for header, filters, and padding */\n  padding-right: 16px; /* Space for scrollbar */\n}\n\n/* Scrollbar styling */\n[data-v-db9e79d9]::-webkit-scrollbar {\n  width: 8px;\n}\n[data-v-db9e79d9]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 4px;\n}\n[data-v-db9e79d9]::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 4px;\n}\n[data-v-db9e79d9]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n/* Firefox scrollbar */\n[data-v-db9e79d9] {\n  scrollbar-width: thin;\n  scrollbar-color: #888 #f1f1f1;\n}\n\n.modal-overlay[data-v-88029c73] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.settings-modal[data-v-88029c73] {\n  background: white;\n  border-radius: 12px;\n  width: 90vw;\n  height: 85vh;\n  max-width: 1200px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n  overflow: hidden; /* Add this to fix border-radius clipping */\n}\n.modal-header[data-v-88029c73] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: #f8f9fa;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h2[data-v-88029c73] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-88029c73] {\n  background: none;\n  border: none;\n  font-size: 2rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: all 0.2s ease;\n}\n.close-btn[data-v-88029c73]:hover {\n  background: #e9ecef;\n  color: #495057;\n}\n.settings-content[data-v-88029c73] {\n  flex: 1;\n  display: flex;\n  overflow: hidden;\n}\n.settings-nav[data-v-88029c73] {\n  width: 280px;\n  background: #f8f9fa;\n  border-right: 1px solid #e9ecef;\n  padding: 20px;\n  overflow-y: auto;\n}\n.nav-section[data-v-88029c73] {\n  margin-bottom: 24px;\n}\n.nav-section h3[data-v-88029c73] {\n  margin: 0 0 12px 0;\n  font-size: 0.9rem;\n  font-weight: 600;\n  color: #666;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.nav-item[data-v-88029c73] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  padding: 12px 16px;\n  border: none;\n  background: none;\n  cursor: pointer;\n  border-radius: 6px;\n  margin-bottom: 4px;\n  transition: all 0.2s ease;\n  text-align: left;\n  font-size: 0.9rem;\n  color: #333;\n}\n.nav-item[data-v-88029c73]:hover:not(:disabled) {\n  background: #e9ecef;\n}\n.nav-item[data-v-88029c73]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  color: #999;\n}\n.nav-item[data-v-88029c73]:disabled:hover {\n  background: transparent;\n  color: #999;\n}\n.nav-item.active[data-v-88029c73] {\n  background: #007bff;\n  color: white;\n}\n.nav-icon[data-v-88029c73] {\n  margin-right: 12px;\n  font-size: 1.1rem;\n}\n.settings-main[data-v-88029c73] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px;\n}\n.section-content[data-v-88029c73] {\n  max-width: 800px;\n}\n.section-header[data-v-88029c73] {\n  margin-bottom: 24px;\n}\n.section-header h3[data-v-88029c73] {\n  margin: 0 0 8px 0;\n  font-size: 1.3rem;\n  font-weight: 600;\n  color: #333;\n}\n.section-header p[data-v-88029c73] {\n  margin: 0;\n  color: #666;\n  font-size: 0.95rem;\n}\n.form-group[data-v-88029c73] {\n  margin-bottom: 20px;\n}\n.form-group label[data-v-88029c73] {\n  display: block;\n  margin-bottom: 6px;\n  font-weight: 500;\n  color: #333;\n  font-size: 0.9rem;\n}\n.form-input[data-v-88029c73],\n.form-select[data-v-88029c73] {\n  width: 100%;\n  padding: 10px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  font-size: 0.9rem;\n}\n.form-input[data-v-88029c73]:focus,\n.form-select[data-v-88029c73]:focus {\n  outline: none;\n  border-color: #007bff;\n  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n.form-group small[data-v-88029c73] {\n  display: block;\n  margin-top: 4px;\n  color: #666;\n  font-size: 0.8rem;\n}\n.form-note[data-v-88029c73] {\n  margin: 0 0 12px 0;\n  color: #666;\n  font-size: 0.9rem;\n  font-style: italic;\n}\n.checkbox-label[data-v-88029c73] {\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n}\n.checkbox-label input[data-v-88029c73] {\n  margin-right: 8px;\n  width: auto;\n}\n.team-members-list[data-v-88029c73] {\n  border: 1px solid #e9ecef;\n  border-radius: 6px;\n  padding: 16px;\n}\n.member-item[data-v-88029c73] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 12px;\n  align-items: center;\n}\n.member-name[data-v-88029c73] {\n  flex: 1;\n  padding: 8px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 4px;\n}\n.member-address[data-v-88029c73] {\n  flex: 2;\n  padding: 8px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 4px;\n  font-family: monospace;\n  background: #f8f9fa;\n}\n.member-info[data-v-88029c73] {\n  font-size: 0.8rem;\n  color: #666;\n  font-style: italic;\n}\n.no-members[data-v-88029c73] {\n  text-align: center;\n  color: #666;\n  font-style: italic;\n  padding: 20px;\n}\n.readonly-field[data-v-88029c73] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.readonly-field input[readonly][data-v-88029c73] {\n  background: #f8f9fa;\n  color: #6c757d;\n  cursor: not-allowed;\n  flex: 1;\n}\n.readonly-field-header[data-v-88029c73] {\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 8px;\n}\n.multisig-badge[data-v-88029c73] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  background: #ffc107;\n  color: #212529;\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.member-item.readonly[data-v-88029c73] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 12px;\n  background: #f8f9fa;\n  border-radius: 6px;\n  border: 1px solid #e9ecef;\n  margin-bottom: 8px;\n}\n.member-display-name[data-v-88029c73] {\n  font-weight: 500;\n  color: #333;\n  font-size: 0.9rem;\n}\n.member-address[data-v-88029c73] {\n  font-family: monospace;\n  color: #6c757d;\n  font-size: 0.8rem;\n  word-break: break-all;\n}\n.empty-state[data-v-88029c73] {\n  text-align: center;\n  padding: 40px 20px;\n  color: #6c757d;\n}\n.empty-icon[data-v-88029c73] {\n  font-size: 2.5rem;\n  display: block;\n  margin-bottom: 12px;\n}\n.empty-state p[data-v-88029c73] {\n  margin: 0 0 8px 0;\n  font-weight: 500;\n  color: #495057;\n}\n.empty-state small[data-v-88029c73] {\n  color: #6c757d;\n}\n.remove-btn[data-v-88029c73] {\n  background: #dc3545;\n  color: white;\n  border: none;\n  border-radius: 50%;\n  width: 32px;\n  height: 32px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.add-member-btn[data-v-88029c73] {\n  background: #28a745;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.9rem;\n}\n.form-actions[data-v-88029c73] {\n  display: flex;\n  gap: 12px;\n  margin-top: 24px;\n}\n.save-btn[data-v-88029c73] {\n  background: #007bff;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.reset-btn[data-v-88029c73] {\n  background: #6c757d;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.voting-stats[data-v-88029c73] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 20px;\n  margin-bottom: 24px;\n}\n.stat-card[data-v-88029c73] {\n  background: #f8f9fa;\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n}\n.stat-number[data-v-88029c73] {\n  font-size: 2rem;\n  font-weight: 700;\n  color: #007bff;\n  margin-bottom: 8px;\n}\n.stat-label[data-v-88029c73] {\n  font-size: 0.9rem;\n  color: #666;\n  font-weight: 500;\n}\n.voting-history-list[data-v-88029c73] {\n  max-height: 400px;\n  overflow-y: auto;\n}\n.vote-item[data-v-88029c73] {\n  background: white;\n  border: 1px solid #e9ecef;\n  border-radius: 6px;\n  padding: 16px;\n  margin-bottom: 12px;\n}\n.vote-header[data-v-88029c73] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 8px;\n}\n.proposal-id[data-v-88029c73] {\n  font-weight: 600;\n  color: #007bff;\n}\n.vote-badge[data-v-88029c73] {\n  padding: 4px 8px;\n  border-radius: 4px;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.vote-badge.aye[data-v-88029c73] {\n  background: #d4edda;\n  color: #155724;\n}\n.vote-badge.nay[data-v-88029c73] {\n  background: #f8d7da;\n  color: #721c24;\n}\n.vote-badge.abstain[data-v-88029c73] {\n  background: #e2e3e5;\n  color: #383d41;\n}\n.vote-title[data-v-88029c73] {\n  font-weight: 500;\n  margin-bottom: 4px;\n}\n.vote-date[data-v-88029c73] {\n  font-size: 0.8rem;\n  color: #666;\n}\n.sync-controls[data-v-88029c73] {\n  background: #f8f9fa;\n  padding: 20px;\n  border-radius: 8px;\n}\n.sync-status[data-v-88029c73] {\n  margin-bottom: 16px;\n}\n.status-item[data-v-88029c73] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 8px;\n}\n.status-label[data-v-88029c73] {\n  font-weight: 500;\n}\n.status-value[data-v-88029c73] {\n  font-family: monospace;\n}\n.status-value.connected[data-v-88029c73] {\n  color: #28a745;\n}\n.status-value.error[data-v-88029c73] {\n  color: #dc3545;\n}\n.sync-actions[data-v-88029c73] {\n  display: flex;\n  gap: 12px;\n}\n.sync-btn[data-v-88029c73] {\n  background: #007bff;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.sync-btn[data-v-88029c73]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.clear-cache-btn[data-v-88029c73] {\n  background: #dc3545;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.coming-soon[data-v-88029c73],\n.under-review[data-v-88029c73] {\n  text-align: center;\n  padding: 40px 20px;\n  background: #f8f9fa;\n  border-radius: 8px;\n}\n.coming-soon-icon[data-v-88029c73],\n.under-review-icon[data-v-88029c73] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n}\n.coming-soon h4[data-v-88029c73],\n.under-review h4[data-v-88029c73] {\n  margin: 0 0 12px 0;\n  color: #333;\n}\n.coming-soon p[data-v-88029c73],\n.under-review p[data-v-88029c73] {\n  margin: 0 0 16px 0;\n  color: #666;\n}\n.coming-soon ul[data-v-88029c73] {\n  text-align: left;\n  max-width: 300px;\n  margin: 0 auto;\n}\n.temp-actions[data-v-88029c73] {\n  margin-top: 20px;\n}\n.refresh-btn[data-v-88029c73] {\n  background: #007bff;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.refresh-btn[data-v-88029c73]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.help-content[data-v-88029c73],\n.about-content[data-v-88029c73] {\n  max-width: 600px;\n}\n.help-section[data-v-88029c73],\n.about-section[data-v-88029c73] {\n  margin-bottom: 24px;\n}\n.help-section h4[data-v-88029c73],\n.about-section h4[data-v-88029c73] {\n  margin: 0 0 12px 0;\n  color: #333;\n  font-size: 1.1rem;\n}\n.help-section ul[data-v-88029c73],\n.help-section ol[data-v-88029c73],\n.about-section ul[data-v-88029c73] {\n  margin: 0;\n  padding-left: 20px;\n}\n.help-section li[data-v-88029c73],\n.about-section li[data-v-88029c73] {\n  margin-bottom: 8px;\n  line-height: 1.5;\n}\n.help-links[data-v-88029c73],\n.about-links[data-v-88029c73] {\n  display: flex;\n  gap: 16px;\n  margin-top: 24px;\n}\n.help-link[data-v-88029c73],\n.about-link[data-v-88029c73] {\n  display: inline-flex;\n  align-items: center;\n  padding: 10px 16px;\n  background: #007bff;\n  color: white;\n  text-decoration: none;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: background-color 0.2s ease;\n}\n.help-link[data-v-88029c73]:hover,\n.about-link[data-v-88029c73]:hover {\n  background: #0056b3;\n}\n.empty-state[data-v-88029c73] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 200px;\n  text-align: center;\n}\n.empty-icon[data-v-88029c73] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n}\n.empty-state h4[data-v-88029c73] {\n  margin: 0 0 8px 0;\n  color: #333;\n}\n.empty-state p[data-v-88029c73] {\n  margin: 0;\n  color: #666;\n}\n.activity-list[data-v-88029c73] {\n  max-height: 400px;\n  overflow-y: auto;\n}\n.activity-item[data-v-88029c73] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n  margin-bottom: 8px;\n}\n.activity-icon[data-v-88029c73] {\n  font-size: 1.2rem;\n}\n.activity-details[data-v-88029c73] {\n  flex: 1;\n}\n.activity-description[data-v-88029c73] {\n  font-size: 0.9rem;\n  color: #333;\n  margin-bottom: 2px;\n}\n.activity-time[data-v-88029c73] {\n  font-size: 0.8rem;\n  color: #666;\n}\n.modal-content[data-v-88029c73] {\n  max-height: 80vh;\n  overflow-y: auto;\n  padding: 20px;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n.settings-section[data-v-88029c73] {\n  margin-bottom: 24px;\n  overflow-y: auto;\n  max-height: calc(80vh - 120px); /* Account for header and padding */\n}\n\n/* Scrollbar styling */\n[data-v-88029c73]::-webkit-scrollbar {\n  width: 8px;\n}\n[data-v-88029c73]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 4px;\n}\n[data-v-88029c73]::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 4px;\n}\n[data-v-88029c73]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n/* Firefox scrollbar */\n[data-v-88029c73] {\n  scrollbar-width: thin;\n  scrollbar-color: #888 #f1f1f1;\n}\n.form-note[data-v-88029c73] {\n  margin-top: 24px;\n  padding: 16px;\n  background: #f8f9ff;\n  border: 1px solid #e1e5f2;\n  border-radius: 8px;\n}\n.form-note p[data-v-88029c73] {\n  margin: 0 0 12px 0;\n  color: #333;\n  font-weight: 500;\n}\n.form-note ol[data-v-88029c73] {\n  margin: 0;\n  padding-left: 20px;\n  color: #666;\n}\n.form-note ol li[data-v-88029c73] {\n  margin-bottom: 4px;\n}\n.sync-section[data-v-88029c73] {\n  background: #f8f9fa;\n  border: 1px solid #e1e5e9;\n  border-radius: 8px;\n  padding: 20px;\n}\n.sync-description[data-v-88029c73] {\n  margin-bottom: 20px;\n}\n.sync-description p[data-v-88029c73] {\n  margin: 0;\n  color: #666;\n  line-height: 1.5;\n}\n.sync-actions[data-v-88029c73] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.sync-btn[data-v-88029c73] {\n  padding: 10px 20px;\n  border: 1px solid #007bff;\n  border-radius: 6px;\n  background: white;\n  color: #007bff;\n  cursor: pointer;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  flex: 1;\n}\n.sync-btn[data-v-88029c73]:hover:not(:disabled) {\n  background: #007bff;\n  color: white;\n}\n.sync-btn[data-v-88029c73]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.sync-btn.deep[data-v-88029c73] {\n  border-color: #28a745;\n  color: #28a745;\n}\n.sync-btn.deep[data-v-88029c73]:hover:not(:disabled) {\n  background: #28a745;\n  color: white;\n}\n.sync-info[data-v-88029c73] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.sync-type[data-v-88029c73] {\n  font-size: 0.9rem;\n  color: #666;\n  line-height: 1.4;\n}\n\n/* Backend Configuration Styles */\n.backend-config[data-v-88029c73] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.backend-actions[data-v-88029c73] {\n  display: flex;\n  gap: 8px;\n}\n.test-btn[data-v-88029c73],\n.save-backend-btn[data-v-88029c73] {\n  padding: 8px 16px;\n  border: 1px solid #007bff;\n  border-radius: 4px;\n  background: white;\n  color: #007bff;\n  cursor: pointer;\n  font-size: 0.85rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  flex: 1;\n}\n.test-btn[data-v-88029c73]:hover:not(:disabled),\n.save-backend-btn[data-v-88029c73]:hover:not(:disabled) {\n  background: #007bff;\n  color: white;\n}\n.save-backend-btn[data-v-88029c73] {\n  border-color: #28a745;\n  color: #28a745;\n}\n.save-backend-btn[data-v-88029c73]:hover:not(:disabled) {\n  background: #28a745;\n  color: white;\n}\n.test-btn[data-v-88029c73]:disabled,\n.save-backend-btn[data-v-88029c73]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.backend-status[data-v-88029c73] {\n  padding: 8px 12px;\n  border-radius: 4px;\n  font-size: 0.85rem;\n  margin-top: 8px;\n}\n.backend-status.success[data-v-88029c73] {\n  background: #d4edda;\n  color: #155724;\n  border: 1px solid #c3e6cb;\n}\n.backend-status.error[data-v-88029c73] {\n  background: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n}\n.backend-status.info[data-v-88029c73] {\n  background: #d1ecf1;\n  color: #0c5460;\n  border: 1px solid #bee5eb;\n}\n\n.content-area[data-v-9210fae2] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.proposals-list[data-v-9210fae2] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.proposal-item[data-v-9210fae2] {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 1rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-item[data-v-9210fae2]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.proposal-header[data-v-9210fae2] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.proposal-id[data-v-9210fae2] {\n  font-size: 0.875rem;\n  color: #6b46c1;\n  font-weight: 600;\n}\n.proposal-title[data-v-9210fae2] {\n  margin: 0.5rem 0;\n  font-size: 1rem;\n  color: #2d3748;\n}\n.proposal-meta[data-v-9210fae2] {\n  display: flex;\n  gap: 1rem;\n  font-size: 0.875rem;\n  color: #718096;\n}\n.meta-item[data-v-9210fae2] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.empty-state[data-v-9210fae2] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-9210fae2] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.content-area[data-v-c680eda7] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.proposals-list[data-v-c680eda7] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.proposal-item[data-v-c680eda7] {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 1rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-item[data-v-c680eda7]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.proposal-header[data-v-c680eda7] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.proposal-id[data-v-c680eda7] {\n  font-size: 0.875rem;\n  color: #6b46c1;\n  font-weight: 600;\n}\n.proposal-title[data-v-c680eda7] {\n  margin: 0.5rem 0;\n  font-size: 1rem;\n  color: #2d3748;\n}\n.proposal-meta[data-v-c680eda7] {\n  display: flex;\n  gap: 1rem;\n  font-size: 0.875rem;\n  color: #718096;\n}\n.meta-item[data-v-c680eda7] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.meta-item.action-type[data-v-c680eda7] {\n  flex-basis: 100%;\n}\n.action-badge[data-v-c680eda7] {\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 0.8rem;\n  font-weight: 500;\n  margin-left: 4px;\n}\n.action-badge.evaluation[data-v-c680eda7] {\n  background: #fff3cd;\n  color: #856404;\n}\n.action-badge.team-vote[data-v-c680eda7] {\n  background: #d1ecf1;\n  color: #0c5460;\n}\n.empty-state[data-v-c680eda7] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-c680eda7] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.content-area[data-v-9dd5dc87] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.proposals-list[data-v-9dd5dc87] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.proposal-item[data-v-9dd5dc87] {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 1rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-item[data-v-9dd5dc87]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.proposal-header[data-v-9dd5dc87] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.proposal-id[data-v-9dd5dc87] {\n  font-size: 0.875rem;\n  color: #6b46c1;\n  font-weight: 600;\n}\n.proposal-title[data-v-9dd5dc87] {\n  margin: 0.5rem 0;\n  font-size: 1rem;\n  color: #2d3748;\n}\n.evaluation-info[data-v-9dd5dc87] {\n  margin: 16px 0;\n  padding: 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n}\n.vote-recommendation[data-v-9dd5dc87] {\n  margin-bottom: 8px;\n}\n.vote-badge[data-v-9dd5dc87] {\n  padding: 4px 8px;\n  background: #007bff;\n  color: white;\n  border-radius: 4px;\n  font-size: 0.8rem;\n  margin-left: 8px;\n}\n.vote-reason[data-v-9dd5dc87] {\n  font-size: 0.9rem;\n  color: #666;\n  margin-top: 8px;\n}\n.proposal-meta[data-v-9dd5dc87] {\n  display: flex;\n  gap: 1rem;\n  font-size: 0.875rem;\n  color: #718096;\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.meta-item[data-v-9dd5dc87] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.empty-state[data-v-9dd5dc87] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-9dd5dc87] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.content-area[data-v-a4d8a9e4] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.empty-state[data-v-a4d8a9e4] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-a4d8a9e4] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.my-dashboard[data-v-f4aa978b] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n/* Loading and Error States */\n.loading-state[data-v-f4aa978b],\n.error-state[data-v-f4aa978b] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  text-align: center;\n}\n.loading-spinner[data-v-f4aa978b] {\n  width: 50px;\n  height: 50px;\n  border: 4px solid #f3f3f3;\n  border-top: 4px solid #6b46c1;\n  border-radius: 50%;\n  animation: spin-f4aa978b 1s linear infinite;\n  margin-bottom: 1rem;\n}\n@keyframes spin-f4aa978b {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.error-icon[data-v-f4aa978b] {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n}\n.retry-btn[data-v-f4aa978b] {\n  margin-top: 1rem;\n  padding: 0.75rem 1.5rem;\n  background: #6b46c1;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.retry-btn[data-v-f4aa978b]:hover {\n  background: #5a37a1;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.15);\n}\n.stats-section[data-v-f4aa978b] {\n  margin-bottom: 1rem;\n}\n.stats-section-container[data-v-f4aa978b] {\n  margin: 16px;\n  display: flex;\n  gap: 1rem;\n}\n.stat-card[data-v-f4aa978b] {\n  flex: 1;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  border: 2px solid transparent;\n  min-width: 150px;\n}\n.stat-card[data-v-f4aa978b]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.15);\n}\n.stat-card.active[data-v-f4aa978b] {\n  border-color: #6b46c1;\n  background: #f8f4ff;\n}\n.stat-number[data-v-f4aa978b] {\n  font-size: 2.5rem;\n  font-weight: bold;\n  color: #2d3748;\n  margin-bottom: 0.5rem;\n}\n.stat-label[data-v-f4aa978b] {\n  font-size: 1rem;\n  color: #4a5568;\n  margin-bottom: 0.5rem;\n}\n.content-section[data-v-f4aa978b] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  padding: 0 16px;\n}\n\n.proposal-item[data-v-1a03f392] {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 1rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-item[data-v-1a03f392]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.agreement-item[data-v-1a03f392] {\n  border-left: 4px solid #ffc107;\n}\n.ready-item[data-v-1a03f392] {\n  border-left: 4px solid #28a745;\n}\n.discussion-item[data-v-1a03f392] {\n  border-left: 4px solid #17a2b8;\n}\n.vetoed-item[data-v-1a03f392] {\n  border-left: 4px solid #dc3545;\n}\n.proposal-header[data-v-1a03f392] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.proposal-id[data-v-1a03f392] {\n  font-size: 0.875rem;\n  color: #6b46c1;\n  font-weight: 600;\n}\n.proposal-title[data-v-1a03f392] {\n  margin: 0.5rem 0;\n  font-size: 1rem;\n  color: #2d3748;\n}\n.agreement-progress[data-v-1a03f392] {\n  margin: 16px 0;\n  padding: 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n}\n.progress-header[data-v-1a03f392] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.progress-count[data-v-1a03f392] {\n  color: #007bff;\n  font-weight: 600;\n}\n.progress-bar[data-v-1a03f392] {\n  height: 8px;\n  background: #e9ecef;\n  border-radius: 4px;\n  overflow: hidden;\n  position: relative;\n}\n.progress-fill[data-v-1a03f392] {\n  height: 100%;\n  transition: width 0.3s ease, background-color 0.3s ease;\n  border-radius: 4px;\n}\n.team-status[data-v-1a03f392] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 20px;\n  margin: 16px 0;\n}\n.status-section h5[data-v-1a03f392] {\n  margin: 0 0 8px 0;\n  font-size: 0.9rem;\n  font-weight: 600;\n  color: #333;\n}\n.member-list[data-v-1a03f392] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.member-badge[data-v-1a03f392] {\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.member-badge.agreed[data-v-1a03f392] {\n  background: #d4edda;\n  color: #155724;\n}\n.member-badge.discussion[data-v-1a03f392] {\n  background: #d1ecf1;\n  color: #0c5460;\n}\n.voting-info[data-v-1a03f392],\n.discussion-info[data-v-1a03f392],\n.veto-info[data-v-1a03f392] {\n  margin: 16px 0;\n  padding: 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n}\n.vote-recommendation[data-v-1a03f392] {\n  margin-bottom: 8px;\n}\n.vote-badge[data-v-1a03f392] {\n  padding: 4px 8px;\n  background: #007bff;\n  color: white;\n  border-radius: 4px;\n  font-size: 0.8rem;\n  margin-left: 8px;\n}\n.vote-reason[data-v-1a03f392] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.veto-alert[data-v-1a03f392] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #721c24;\n}\n.alert-icon[data-v-1a03f392] {\n  font-size: 1.2rem;\n}\n.veto-reason[data-v-1a03f392] {\n  margin-top: 0.25rem;\n  font-size: 0.875rem;\n  color: #718096;\n}\n.veto-date[data-v-1a03f392] {\n  margin-top: 0.25rem;\n  font-size: 0.875rem;\n  color: #718096;\n}\n.no-members[data-v-1a03f392] {\n  color: #666;\n  font-style: italic;\n  font-size: 0.9rem;\n}\n.proposal-meta[data-v-1a03f392] {\n  display: flex;\n  gap: 1rem;\n  font-size: 0.875rem;\n  color: #718096;\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.meta-item[data-v-1a03f392] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n\n.content-area[data-v-bddfa2c9] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.panel-header[data-v-bddfa2c9] {\n  margin-bottom: 24px;\n}\n.panel-header h3[data-v-bddfa2c9] {\n  margin: 0 0 8px 0;\n  color: #333;\n  font-size: 1.2rem;\n}\n.panel-header p[data-v-bddfa2c9] {\n  margin: 0;\n  color: #666;\n  font-size: 0.9rem;\n}\n.proposals-list[data-v-bddfa2c9] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.empty-state[data-v-bddfa2c9] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-bddfa2c9] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.content-area[data-v-aac09e73] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.panel-header[data-v-aac09e73] {\n  margin-bottom: 24px;\n}\n.panel-header h3[data-v-aac09e73] {\n  margin: 0 0 8px 0;\n  color: #333;\n  font-size: 1.2rem;\n}\n.panel-header p[data-v-aac09e73] {\n  margin: 0;\n  color: #666;\n  font-size: 0.9rem;\n}\n.proposals-list[data-v-aac09e73] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.empty-state[data-v-aac09e73] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-aac09e73] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n.send-to-mimir-btn[data-v-aac09e73] {\n  background: #e6007a;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  padding: 8px 16px;\n  font-size: 14px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 120px;\n  margin-top: 12px;\n  transition: background 0.3s, opacity 0.3s;\n}\n.send-to-mimir-btn[data-v-aac09e73]:hover:not(:disabled) {\n  background: #c40069;\n}\n.send-to-mimir-btn[data-v-aac09e73]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.loading-spinner[data-v-aac09e73] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid #f3f3f3;\n  border-top: 2px solid #ffffff;\n  border-radius: 50%;\n  animation: spin-aac09e73 1s linear infinite;\n}\n@keyframes spin-aac09e73 {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n\n.content-area[data-v-2e7af979] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.panel-header[data-v-2e7af979] {\n  margin-bottom: 24px;\n}\n.panel-header h3[data-v-2e7af979] {\n  margin: 0 0 8px 0;\n  color: #333;\n  font-size: 1.2rem;\n}\n.panel-header p[data-v-2e7af979] {\n  margin: 0;\n  color: #666;\n  font-size: 0.9rem;\n}\n.proposals-list[data-v-2e7af979] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.empty-state[data-v-2e7af979] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-2e7af979] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.content-area[data-v-03d5c226] {\n  flex: 1;\n  overflow-y: auto;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.panel-header[data-v-03d5c226] {\n  margin-bottom: 24px;\n}\n.panel-header h3[data-v-03d5c226] {\n  margin: 0 0 8px 0;\n  color: #333;\n  font-size: 1.2rem;\n}\n.panel-header p[data-v-03d5c226] {\n  margin: 0;\n  color: #666;\n  font-size: 0.9rem;\n}\n.proposals-list[data-v-03d5c226] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.empty-state[data-v-03d5c226] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-03d5c226] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.modal-overlay[data-v-cafa1a99] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-cafa1a99] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  width: 400px;\n  max-width: 90vw;\n}\n.modal-header[data-v-cafa1a99] {\n  padding: 20px 24px 0;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.icon[data-v-cafa1a99] {\n  font-size: 24px;\n}\n.icon-success[data-v-cafa1a99] { color: #28a745;\n}\n.icon-error[data-v-cafa1a99] { color: #dc3545;\n}\n.icon-warning[data-v-cafa1a99] { color: #ffc107;\n}\n.icon-info[data-v-cafa1a99] { color: #007bff;\n}\n.modal-header h3[data-v-cafa1a99] {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: #333;\n}\n.modal-body[data-v-cafa1a99] {\n  padding: 16px 24px 20px;\n}\n.modal-body p[data-v-cafa1a99] {\n  margin: 0;\n  color: #666;\n  line-height: 1.5;\n}\n.modal-actions[data-v-cafa1a99] {\n  padding: 0 24px 24px;\n  display: flex;\n  justify-content: flex-end;\n}\n.ok-btn[data-v-cafa1a99] {\n  padding: 8px 24px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  color: white;\n}\n.ok-btn.success[data-v-cafa1a99] {\n  background: #28a745;\n  border-color: #28a745;\n}\n.ok-btn.success[data-v-cafa1a99]:hover {\n  background: #218838;\n  border-color: #218838;\n}\n.ok-btn.error[data-v-cafa1a99] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.ok-btn.error[data-v-cafa1a99]:hover {\n  background: #c82333;\n  border-color: #c82333;\n}\n.ok-btn.warning[data-v-cafa1a99] {\n  background: #ffc107;\n  border-color: #ffc107;\n  color: #212529;\n}\n.ok-btn.warning[data-v-cafa1a99]:hover {\n  background: #e0a800;\n  border-color: #e0a800;\n}\n.ok-btn.info[data-v-cafa1a99] {\n  background: #007bff;\n  border-color: #007bff;\n}\n.ok-btn.info[data-v-cafa1a99]:hover {\n  background: #0056b3;\n  border-color: #0056b3;\n}\n\n.workflow[data-v-b5f0df04] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.stats-section[data-v-b5f0df04] {\n  margin-bottom: 1rem;\n}\n.stats-section-container[data-v-b5f0df04] {\n  margin: 16px;\n  display: flex;\n  gap: 1rem;\n}\n.stat-card[data-v-b5f0df04] {\n  flex: 1;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  border: 2px solid transparent;\n  min-width: 150px;\n}\n.stat-card[data-v-b5f0df04]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.15);\n}\n.stat-card.active[data-v-b5f0df04] {\n  border-color: #6b46c1;\n  background: #f8f4ff;\n}\n.stat-number[data-v-b5f0df04] {\n  font-size: 2.5rem;\n  font-weight: bold;\n  color: #2d3748;\n  margin-bottom: 0.5rem;\n}\n.stat-label[data-v-b5f0df04] {\n  font-size: 1rem;\n  color: #4a5568;\n  margin-bottom: 0.5rem;\n}\n.content-section[data-v-b5f0df04] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  padding: 0 16px;\n}\n.loading-state[data-v-b5f0df04],\n.error-state[data-v-b5f0df04] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 300px;\n  text-align: center;\n}\n.loading-spinner[data-v-b5f0df04] {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #f3f3f3;\n  border-top: 3px solid #007bff;\n  border-radius: 50%;\n  animation: spin-b5f0df04 1s linear infinite;\n  margin-bottom: 16px;\n}\n@keyframes spin-b5f0df04 {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.error-icon[data-v-b5f0df04] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n  color: #dc3545;\n}\n.error-state h3[data-v-b5f0df04] {\n  margin: 0 0 8px 0;\n  color: #dc3545;\n}\n.error-state p[data-v-b5f0df04] {\n  margin: 0 0 16px 0;\n  color: #666;\n}\n.retry-btn[data-v-b5f0df04] {\n  padding: 8px 16px;\n  background: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: background-color 0.2s ease;\n}\n.retry-btn[data-v-b5f0df04]:hover {\n  background: #0056b3;\n}\n\n.modal-overlay[data-v-3b186cf1] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.dashboard-modal[data-v-3b186cf1] {\n  background: white;\n  border-radius: 12px;\n  width: 95vw;\n  height: 90vh;\n  max-width: 1400px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n}\n.modal-header[data-v-3b186cf1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: #f8f9fa;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h2[data-v-3b186cf1] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-3b186cf1] {\n  background: none;\n  border: none;\n  font-size: 2rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: all 0.2s ease;\n}\n.close-btn[data-v-3b186cf1]:hover {\n  background: #e9ecef;\n  color: #495057;\n}\n.dashboard-content[data-v-3b186cf1] {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n}\n.auth-required[data-v-3b186cf1] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 2rem;\n}\n.auth-icon[data-v-3b186cf1] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n}\n.auth-required h3[data-v-3b186cf1] {\n  margin: 0 0 8px 0;\n  color: #333;\n}\n.auth-required p[data-v-3b186cf1] {\n  margin: 0 0 16px 0;\n  color: #666;\n}\n.connect-btn[data-v-3b186cf1] {\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.connect-btn[data-v-3b186cf1]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n\n/* Tab Navigation */\n.tab-navigation[data-v-3b186cf1] {\n  display: flex;\n  border-bottom: 1px solid #e9ecef;\n  background: white;\n  padding: 0 16px;\n}\n.tab-btn[data-v-3b186cf1] {\n  flex: 1;\n  padding: 16px 20px;\n  border: none;\n  background: none;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #666;\n  border-bottom: 3px solid transparent;\n  transition: all 0.2s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.tab-btn.active[data-v-3b186cf1] {\n  color: #007bff;\n  border-bottom-color: #007bff;\n  background: #f8f9fa;\n}\n.tab-btn[data-v-3b186cf1]:hover:not(.active) {\n  background: #f8f9fa;\n  color: #333;\n}\n.tab-icon[data-v-3b186cf1] {\n  font-size: 1.1rem;\n}\n.tab-content[data-v-3b186cf1] {\n  flex: 1;\n  display: flex;\n  overflow: hidden;\n}\n\n/* Scrollbar styling */\n[data-v-3b186cf1]::-webkit-scrollbar {\n  width: 8px;\n}\n[data-v-3b186cf1]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 4px;\n}\n[data-v-3b186cf1]::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 4px;\n}\n[data-v-3b186cf1]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n/* Firefox scrollbar */\n[data-v-3b186cf1] {\n  scrollbar-width: thin;\n  scrollbar-color: #888 #f1f1f1;\n}\n\n.menu-container[data-v-e2e1959b] {\n  width: 100%;\n}\n.user-status[data-v-e2e1959b] {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f0f0f0;\n  background: #f8f9fa;\n}\n.user-info[data-v-e2e1959b] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.user-avatar[data-v-e2e1959b] {\n  width: 40px;\n  height: 40px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 14px;\n}\n.user-details[data-v-e2e1959b] {\n  flex: 1;\n}\n.user-name[data-v-e2e1959b] {\n  font-weight: 600;\n  color: #333;\n  font-size: 14px;\n  margin-bottom: 2px;\n}\n.user-address[data-v-e2e1959b] {\n  font-family: monospace;\n  font-size: 12px;\n  color: #666;\n  margin-bottom: 2px;\n}\n.user-network[data-v-e2e1959b] {\n  font-size: 11px;\n  color: #999;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.logout-btn[data-v-e2e1959b] {\n  background: #dc3545;\n  color: white;\n  border: none;\n  padding: 6px 12px;\n  border-radius: 6px;\n  font-size: 12px;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n.logout-btn[data-v-e2e1959b]:hover:not(:disabled) {\n  background: #c82333;\n}\n.logout-btn[data-v-e2e1959b]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.login-prompt[data-v-e2e1959b] {\n  text-align: center;\n  padding: 20px 0;\n}\n.login-icon[data-v-e2e1959b] {\n  font-size: 32px;\n  margin-bottom: 8px;\n}\n.login-text[data-v-e2e1959b] {\n  color: #666;\n  font-size: 14px;\n  margin-bottom: 16px;\n}\n.connect-btn[data-v-e2e1959b] {\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.connect-btn[data-v-e2e1959b]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.menu-items[data-v-e2e1959b] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.menu-item[data-v-e2e1959b] {\n  padding: 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  background: #ffffff;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.menu-item[data-v-e2e1959b]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.menu-item .icon[data-v-e2e1959b] {\n  font-size: 1.25rem;\n  width: 1.5rem;\n  text-align: center;\n}\n.menu-item span[data-v-e2e1959b]:not(.icon) {\n  font-size: 1rem;\n  color: #2d3748;\n  font-weight: 500;\n}\n\n/* Modal styles */\n.modal-overlay[data-v-e2e1959b] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-e2e1959b] {\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  max-width: 90vw;\n  max-height: 90vh;\n  overflow: auto;\n}\n\n.voting-tool-container[data-v-c1fca634] {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 999999;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  pointer-events: none; /* Allow clicks to pass through the container */\n}\n\n/* Floating Button */\n.floating-button[data-v-c1fca634] {\n  width: 60px;\n  height: 60px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 4px 20px rgba(230, 0, 122, 0.4);\n  transition: all 0.3s ease;\n  border: 3px solid white;\n  pointer-events: auto; /* Make the button clickable */\n}\n.floating-button[data-v-c1fca634]:hover {\n  transform: scale(1.1);\n  box-shadow: 0 6px 25px rgba(230, 0, 122, 0.6);\n}\n.floating-button.menu-open[data-v-c1fca634] {\n  background: linear-gradient(135deg, #ff1493, #e6007a);\n}\n.button-icon[data-v-c1fca634] {\n  font-size: 24px;\n  color: white;\n  font-weight: bold;\n}\n.hamburger-icon[data-v-c1fca634] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 3px;\n}\n.hamburger-icon span[data-v-c1fca634] {\n  width: 20px;\n  height: 2px;\n  background-color: white;\n  border-radius: 1px;\n  transition: all 0.3s ease;\n}\n\n/* Dropdown Menu */\n.dropdown-menu[data-v-c1fca634] {\n  position: absolute;\n  bottom: 0;\n  right: 70px;\n  width: 280px;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  overflow: hidden;\n  animation: smoothExpand-c1fca634 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  transform-origin: bottom right;\n  pointer-events: auto; /* Make the menu clickable */\n}\n@keyframes smoothExpand-c1fca634 {\n0% {\n    opacity: 0;\n    transform: scale(0.1);\n}\n100% {\n    opacity: 1;\n    transform: scale(1);\n}\n}\n.menu-content[data-v-c1fca634] {\n  padding: 16px 0;\n}\n.menu-item[data-v-c1fca634] {\n  display: flex;\n  align-items: center;\n  padding: 16px 20px;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  border-bottom: 1px solid #f0f0f0;\n}\n.menu-item[data-v-c1fca634]:last-child {\n  border-bottom: none;\n}\n.menu-item[data-v-c1fca634]:hover {\n  background-color: #f8f9fa;\n}\n.menu-item .icon[data-v-c1fca634] {\n  font-size: 20px;\n  margin-right: 12px;\n  width: 24px;\n  text-align: center;\n}\n.menu-item span[data-v-c1fca634]:last-child {\n  font-size: 14px;\n  color: #333;\n  font-weight: 500;\n}\n\n/* Modal styles */\n.modal-overlay[data-v-a01f811b] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.status-modal[data-v-a01f811b] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-a01f811b] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-a01f811b] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-a01f811b] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-a01f811b]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-a01f811b] {\n  padding: 24px;\n  flex: 1;\n  overflow-y: auto;\n}\n.modal-content p[data-v-a01f811b] {\n  margin: 0 0 16px 0;\n  color: #495057;\n}\n.status-options[data-v-a01f811b] {\n  margin: 16px 0;\n}\n.status-options label[data-v-a01f811b] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #495057;\n}\n.status-list[data-v-a01f811b] {\n  max-height: 300px;\n  overflow-y: auto;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  margin-bottom: 16px;\n}\n.status-option[data-v-a01f811b] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 16px;\n  border: none;\n  border-bottom: 1px solid #f0f0f0;\n  background: white;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  font-size: 0.9rem;\n  width: 100%;\n  text-align: left;\n}\n.status-option[data-v-a01f811b]:last-child {\n  border-bottom: none;\n}\n.status-option[data-v-a01f811b]:hover {\n  background: #f8f9fa;\n}\n.status-option.selected[data-v-a01f811b] {\n  background: linear-gradient(135deg, #fff5f8, #ffe8f0);\n  border-left: 4px solid #e6007a;\n}\n.option-text[data-v-a01f811b] {\n  font-weight: 500;\n  color: #333;\n}\n.selected-indicator[data-v-a01f811b] {\n  color: #e6007a;\n  font-weight: bold;\n  font-size: 1rem;\n}\n.reason-section[data-v-a01f811b] {\n  margin: 16px 0;\n}\n.reason-section label[data-v-a01f811b] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #495057;\n}\n.reason-section textarea[data-v-a01f811b] {\n  width: 100%;\n  padding: 12px;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  font-family: inherit;\n  font-size: 0.9rem;\n  resize: vertical;\n  transition: border-color 0.2s ease;\n}\n.reason-section textarea[data-v-a01f811b]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.modal-actions[data-v-a01f811b] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-a01f811b] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.btn[data-v-a01f811b]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-primary[data-v-a01f811b] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.btn-primary[data-v-a01f811b]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-secondary[data-v-a01f811b] {\n  background: #6c757d;\n  color: white;\n  border: 1px solid #6c757d;\n}\n.btn-secondary[data-v-a01f811b]:hover:not(:disabled) {\n  background: #5a6268;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);\n}\n@media (max-width: 768px) {\n.status-grid[data-v-a01f811b] {\n    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n}\n}\n\n/* Modal styles */\n.modal-overlay[data-v-5f7a28c8] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.assign-modal[data-v-5f7a28c8] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-5f7a28c8] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-5f7a28c8] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-5f7a28c8] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-5f7a28c8]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-5f7a28c8] {\n  padding: 24px;\n}\n.modal-content p[data-v-5f7a28c8] {\n  margin: 0 0 16px 0;\n  color: #495057;\n}\n.modal-actions[data-v-5f7a28c8] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-5f7a28c8] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.btn[data-v-5f7a28c8]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-primary[data-v-5f7a28c8] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.btn-primary[data-v-5f7a28c8]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-secondary[data-v-5f7a28c8] {\n  background: #6c757d;\n  color: white;\n  border: 1px solid #6c757d;\n}\n.btn-secondary[data-v-5f7a28c8]:hover:not(:disabled) {\n  background: #5a6268;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);\n}\n.error-message[data-v-5f7a28c8] {\n  background-color: #fff2f0;\n  border: 1px solid #ffccc7;\n  color: #ff4d4f;\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 16px;\n  font-size: 0.9rem;\n}\n\n/* Modal styles */\n.modal-overlay[data-v-281fbad4] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.unassign-modal[data-v-281fbad4] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-281fbad4] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-281fbad4] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-281fbad4] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-281fbad4]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-281fbad4] {\n  padding: 24px;\n}\n.modal-content p[data-v-281fbad4] {\n  margin: 0 0 16px 0;\n  color: #495057;\n}\n.form-group[data-v-281fbad4] {\n  margin-bottom: 20px;\n}\n.form-group label[data-v-281fbad4] {\n  display: block;\n  margin-bottom: 8px;\n  color: #495057;\n  font-weight: 500;\n}\n.form-control[data-v-281fbad4] {\n  width: 100%;\n  padding: 10px;\n  border: 1px solid #ced4da;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  line-height: 1.5;\n  transition: border-color 0.2s ease;\n  resize: vertical;\n}\n.form-control[data-v-281fbad4]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 2px rgba(230, 0, 122, 0.1);\n}\n.current-values[data-v-281fbad4] {\n  background: #f8f9fa;\n  padding: 16px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n}\n.current-values ul[data-v-281fbad4] {\n  margin: 8px 0 0 0;\n  padding-left: 20px;\n  color: #6c757d;\n}\n.error-message[data-v-281fbad4] {\n  background-color: #fff2f0;\n  border: 1px solid #ffccc7;\n  color: #ff4d4f;\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 16px;\n  font-size: 0.9rem;\n}\n.modal-actions[data-v-281fbad4] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-281fbad4] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.btn[data-v-281fbad4]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-primary[data-v-281fbad4] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.btn-primary[data-v-281fbad4]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-secondary[data-v-281fbad4] {\n  background: #6c757d;\n  color: white;\n  border: 1px solid #6c757d;\n}\n.btn-secondary[data-v-281fbad4]:hover:not(:disabled) {\n  background: #5a6268;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);\n}\n\n/* Modal styles */\n.modal-overlay[data-v-eeb2c9ac] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.vote-modal[data-v-eeb2c9ac] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-eeb2c9ac] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-eeb2c9ac] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-eeb2c9ac] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-eeb2c9ac]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-eeb2c9ac] {\n  padding: 24px;\n}\n.modal-content p[data-v-eeb2c9ac] {\n  margin: 0 0 16px 0;\n  color: #495057;\n}\n.vote-options[data-v-eeb2c9ac] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin: 16px 0;\n}\n.vote-option[data-v-eeb2c9ac] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 16px 20px;\n  border: 2px solid #e9ecef;\n  border-radius: 8px;\n  background: white;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  font-size: 1rem;\n  text-align: center;\n}\n.vote-option[data-v-eeb2c9ac]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.vote-option.selected[data-v-eeb2c9ac] {\n  border-color: #e6007a;\n  background: linear-gradient(135deg, #fff5f8, #ffe8f0);\n}\n.vote-option.aye[data-v-eeb2c9ac]:hover,\n.vote-option.aye.selected[data-v-eeb2c9ac] {\n  border-color: #28a745;\n  background: linear-gradient(135deg, #f8fff9, #e8f5e8);\n}\n.vote-option.nay[data-v-eeb2c9ac]:hover,\n.vote-option.nay.selected[data-v-eeb2c9ac] {\n  border-color: #dc3545;\n  background: linear-gradient(135deg, #fff8f8, #ffe8e8);\n}\n.vote-option.abstain[data-v-eeb2c9ac]:hover,\n.vote-option.abstain.selected[data-v-eeb2c9ac] {\n  border-color: #6f42c1;\n  background: linear-gradient(135deg, #faf8ff, #f0e8ff);\n}\n.vote-icon[data-v-eeb2c9ac] {\n  font-size: 1.5rem;\n}\n.vote-text[data-v-eeb2c9ac] {\n  font-weight: 600;\n}\n.reason-section[data-v-eeb2c9ac] {\n  margin: 16px 0;\n}\n.reason-section label[data-v-eeb2c9ac] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #495057;\n}\n.reason-section textarea[data-v-eeb2c9ac] {\n  width: 100%;\n  padding: 12px;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  font-family: inherit;\n  font-size: 0.9rem;\n  resize: vertical;\n  transition: border-color 0.2s ease;\n}\n.reason-section textarea[data-v-eeb2c9ac]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.modal-actions[data-v-eeb2c9ac] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-eeb2c9ac] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.btn[data-v-eeb2c9ac]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-primary[data-v-eeb2c9ac] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.btn-primary[data-v-eeb2c9ac]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-secondary[data-v-eeb2c9ac] {\n  background: #6c757d;\n  color: white;\n  border: 1px solid #6c757d;\n}\n.btn-secondary[data-v-eeb2c9ac]:hover:not(:disabled) {\n  background: #5a6268;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);\n}\n@media (max-width: 768px) {\n.vote-options[data-v-eeb2c9ac] {\n    flex-direction: column;\n}\n}\n\n.modal-overlay[data-v-e479232c] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-e479232c] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  width: 400px;\n  max-width: 90vw;\n}\n.modal-header[data-v-e479232c] {\n  padding: 20px 24px 0;\n}\n.modal-header h3[data-v-e479232c] {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: #333;\n}\n.modal-body[data-v-e479232c] {\n  padding: 16px 24px 20px;\n}\n.modal-body p[data-v-e479232c] {\n  margin: 0;\n  color: #666;\n  line-height: 1.5;\n}\n.modal-actions[data-v-e479232c] {\n  padding: 0 24px 24px;\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.cancel-btn[data-v-e479232c], .confirm-btn[data-v-e479232c] {\n  padding: 8px 16px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.cancel-btn[data-v-e479232c] {\n  background: white;\n  color: #666;\n}\n.cancel-btn[data-v-e479232c]:hover {\n  background: #f8f9fa;\n}\n.confirm-btn[data-v-e479232c] {\n  background: #007bff;\n  color: white;\n  border-color: #007bff;\n}\n.confirm-btn[data-v-e479232c]:hover {\n  background: #0056b3;\n  border-color: #0056b3;\n}\n.confirm-btn.danger[data-v-e479232c] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.confirm-btn.danger[data-v-e479232c]:hover {\n  background: #c82333;\n  border-color: #c82333;\n}\n.confirm-btn.warning[data-v-e479232c] {\n  background: #ffc107;\n  border-color: #ffc107;\n  color: #212529;\n}\n.confirm-btn.warning[data-v-e479232c]:hover {\n  background: #e0a800;\n  border-color: #e0a800;\n}\n.confirm-btn.primary[data-v-e479232c] {\n  background: #007bff;\n  border-color: #007bff;\n}\n.confirm-btn.primary[data-v-e479232c]:hover {\n  background: #0056b3;\n  border-color: #0056b3;\n}\n\n.team-actions-panel[data-v-b45f2dbf] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  width: 500px;\n  max-height: 700px;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.panel-header[data-v-b45f2dbf] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid #f0f0f0;\n  background: #f8f9fa;\n}\n.panel-header h3[data-v-b45f2dbf] {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-b45f2dbf] {\n  background: none;\n  border: none;\n  font-size: 18px;\n  cursor: pointer;\n  color: #666;\n  padding: 4px;\n  border-radius: 4px;\n}\n.close-btn[data-v-b45f2dbf]:hover {\n  background: #e9ecef;\n}\n.loading-state[data-v-b45f2dbf] {\n  padding: 40px 20px;\n  text-align: center;\n  color: #666;\n}\n.spinner[data-v-b45f2dbf] {\n  width: 32px;\n  height: 32px;\n  border: 3px solid #f0f0f0;\n  border-top: 3px solid #e6007a;\n  border-radius: 50%;\n  animation: spin-b45f2dbf 1s linear infinite;\n  margin: 0 auto 16px;\n}\n@keyframes spin-b45f2dbf {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.panel-content[data-v-b45f2dbf] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 20px;\n}\n.agreement-section[data-v-b45f2dbf],\n.team-status-section[data-v-b45f2dbf],\n.user-actions-section[data-v-b45f2dbf],\n.vote-section[data-v-b45f2dbf],\n.discussion-section[data-v-b45f2dbf] {\n  margin-bottom: 24px;\n}\n.agreement-section h4[data-v-b45f2dbf],\n.team-status-section h4[data-v-b45f2dbf],\n.user-actions-section h4[data-v-b45f2dbf],\n.vote-section h4[data-v-b45f2dbf],\n.discussion-section h4[data-v-b45f2dbf] {\n  margin: 0 0 12px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n}\n.agreement-bar[data-v-b45f2dbf] {\n  margin-bottom: 8px;\n}\n.progress-bar[data-v-b45f2dbf] {\n  width: 100%;\n  height: 8px;\n  background: #f0f0f0;\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 8px;\n}\n.progress-fill[data-v-b45f2dbf] {\n  height: 100%;\n  background: linear-gradient(135deg, #28a745, #20c997);\n  transition: width 0.3s ease;\n}\n.progress-fill.vetoed[data-v-b45f2dbf] {\n  background: linear-gradient(135deg, #dc3545, #c82333);\n}\n.agreement-text[data-v-b45f2dbf] {\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n}\n.veto-text[data-v-b45f2dbf] {\n  color: #dc3545;\n  font-weight: 600;\n}\n.veto-reason[data-v-b45f2dbf] {\n  margin-top: 8px;\n  padding: 8px;\n  background: #f8d7da;\n  border: 1px solid #f5c6cb;\n  border-radius: 4px;\n  font-size: 12px;\n  color: #721c24;\n}\n.team-members[data-v-b45f2dbf] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.member-status[data-v-b45f2dbf] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px;\n  border-radius: 6px;\n  border: 1px solid #e9ecef;\n}\n.member-status.agreed[data-v-b45f2dbf] {\n  background: #d4edda;\n  border-color: #c3e6cb;\n}\n.member-status.recused[data-v-b45f2dbf] {\n  background: #f8f9fa;\n  border-color: #dee2e6;\n}\n.member-status.discuss[data-v-b45f2dbf] {\n  background: #fff3cd;\n  border-color: #ffeaa7;\n}\n.member-info[data-v-b45f2dbf] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.member-avatar[data-v-b45f2dbf] {\n  width: 24px;\n  height: 24px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 10px;\n}\n.member-name[data-v-b45f2dbf] {\n  font-size: 12px;\n  font-weight: 500;\n  color: #333;\n}\n.member-address[data-v-b45f2dbf] {\n  font-size: 10px;\n  color: #666;\n  font-family: monospace;\n}\n.action-badge[data-v-b45f2dbf] {\n  font-size: 10px;\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-weight: 500;\n}\n.action-agreed[data-v-b45f2dbf] {\n  background: #28a745;\n  color: white;\n}\n.action-recused[data-v-b45f2dbf] {\n  background: #6c757d;\n  color: white;\n}\n.action-discuss[data-v-b45f2dbf] {\n  background: #ffc107;\n  color: #212529;\n}\n.action-pending[data-v-b45f2dbf] {\n  background: #e9ecef;\n  color: #666;\n}\n.action-buttons[data-v-b45f2dbf] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.action-btn[data-v-b45f2dbf] {\n  padding: 8px 12px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  background: white;\n  cursor: pointer;\n  font-size: 12px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.action-btn[data-v-b45f2dbf]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.action-btn.active[data-v-b45f2dbf] {\n  border-color: #e6007a;\n  background: #e6007a;\n  color: white;\n}\n.action-btn[data-v-b45f2dbf]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.agree-btn.active[data-v-b45f2dbf] {\n  background: #28a745;\n  border-color: #28a745;\n}\n.discuss-btn.active[data-v-b45f2dbf] {\n  background: #ffc107;\n  border-color: #ffc107;\n  color: #212529;\n}\n.veto-btn.active[data-v-b45f2dbf] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.recuse-btn.active[data-v-b45f2dbf] {\n  background: #6c757d;\n  border-color: #6c757d;\n}\n.vote-buttons[data-v-b45f2dbf] {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 12px;\n}\n.vote-btn[data-v-b45f2dbf] {\n  flex: 1;\n  padding: 8px 12px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  background: white;\n  cursor: pointer;\n  font-size: 12px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.vote-btn[data-v-b45f2dbf]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.vote-btn.active[data-v-b45f2dbf] {\n  color: white;\n}\n.aye-btn.active[data-v-b45f2dbf] {\n  background: #28a745;\n  border-color: #28a745;\n}\n.nay-btn.active[data-v-b45f2dbf] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.abstain-btn.active[data-v-b45f2dbf] {\n  background: #6c757d;\n  border-color: #6c757d;\n}\n.reason-input[data-v-b45f2dbf] {\n  width: 100%;\n  min-height: 60px;\n  padding: 8px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 12px;\n  resize: vertical;\n}\n.comments-list[data-v-b45f2dbf] {\n  max-height: 280px;\n  overflow-y: auto;\n  margin-bottom: 16px;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  background: #fafbfc;\n}\n.comment[data-v-b45f2dbf] {\n  padding: 12px;\n  border-bottom: 1px solid #f0f0f0;\n}\n.comment[data-v-b45f2dbf]:last-child {\n  border-bottom: none;\n}\n.comment-header[data-v-b45f2dbf] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 8px;\n}\n.comment-author[data-v-b45f2dbf] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.author-avatar[data-v-b45f2dbf] {\n  width: 20px;\n  height: 20px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 8px;\n}\n.author-name[data-v-b45f2dbf] {\n  font-size: 11px;\n  font-weight: 500;\n  color: #333;\n}\n.comment-time[data-v-b45f2dbf] {\n  font-size: 10px;\n  color: #666;\n}\n.delete-comment-btn[data-v-b45f2dbf] {\n  background: none;\n  border: none;\n  font-size: 12px;\n  cursor: pointer;\n  color: #666;\n  padding: 2px;\n  border-radius: 3px;\n}\n.delete-comment-btn[data-v-b45f2dbf]:hover {\n  background: #f8f9fa;\n}\n.comment-content[data-v-b45f2dbf] {\n  font-size: 12px;\n  color: #333;\n  line-height: 1.4;\n}\n.no-comments[data-v-b45f2dbf] {\n  padding: 40px 20px;\n  text-align: center;\n}\n.empty-state[data-v-b45f2dbf] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.empty-icon[data-v-b45f2dbf] {\n  font-size: 32px;\n  opacity: 0.5;\n}\n.empty-text[data-v-b45f2dbf] {\n  font-size: 14px;\n  font-weight: 500;\n  color: #666;\n}\n.empty-subtext[data-v-b45f2dbf] {\n  font-size: 12px;\n  color: #999;\n}\n.add-comment[data-v-b45f2dbf] {\n  border-top: 1px solid #e9ecef;\n  padding-top: 16px;\n}\n.comment-input-wrapper[data-v-b45f2dbf] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.comment-input[data-v-b45f2dbf] {\n  min-height: 80px;\n  padding: 12px;\n  border: 2px solid #dee2e6;\n  border-radius: 8px;\n  font-size: 13px;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  resize: vertical;\n  transition: border-color 0.2s ease;\n}\n.comment-input[data-v-b45f2dbf]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.comment-actions[data-v-b45f2dbf] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.comment-hint[data-v-b45f2dbf] {\n  flex: 1;\n}\n.hint-text[data-v-b45f2dbf] {\n  font-size: 11px;\n  color: #666;\n}\n.add-comment-btn[data-v-b45f2dbf] {\n  padding: 8px 16px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.add-comment-btn[data-v-b45f2dbf]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.add-comment-btn[data-v-b45f2dbf]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n/* Modal Styles */\n.modal-overlay[data-v-b45f2dbf] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-b45f2dbf] {\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  max-width: 400px;\n  width: 90%;\n}\n.modal-content h3[data-v-b45f2dbf] {\n  margin: 0 0 16px 0;\n  font-size: 18px;\n  color: #333;\n}\n.veto-reason-input[data-v-b45f2dbf] {\n  width: 100%;\n  min-height: 80px;\n  padding: 12px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  margin: 16px 0;\n  resize: vertical;\n}\n.modal-actions[data-v-b45f2dbf] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.cancel-btn[data-v-b45f2dbf],\n.veto-confirm-btn[data-v-b45f2dbf] {\n  padding: 8px 16px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.cancel-btn[data-v-b45f2dbf] {\n  background: white;\n  color: #333;\n}\n.cancel-btn[data-v-b45f2dbf]:hover {\n  background: #f8f9fa;\n}\n.veto-confirm-btn[data-v-b45f2dbf] {\n  background: #dc3545;\n  color: white;\n  border-color: #dc3545;\n}\n.veto-confirm-btn[data-v-b45f2dbf]:hover:not(:disabled) {\n  background: #c82333;\n}\n.veto-confirm-btn[data-v-b45f2dbf]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n/* Veto Reason Section */\n.veto-reason-section[data-v-b45f2dbf] {\n  background: #fff5f5;\n  border: 1px solid #fed7d7;\n  border-radius: 8px;\n  padding: 16px;\n  margin-bottom: 20px;\n}\n.veto-reason-section h4[data-v-b45f2dbf] {\n  margin: 0 0 12px 0;\n  color: #e53e3e;\n  font-size: 1rem;\n  font-weight: 600;\n}\n.veto-reason-content[data-v-b45f2dbf] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.veto-by[data-v-b45f2dbf] {\n  font-size: 0.9rem;\n  color: #e53e3e;\n}\n.veto-reason-text[data-v-b45f2dbf] {\n  font-size: 0.9rem;\n  color: #2d3748;\n  background: white;\n  padding: 12px;\n  border-radius: 6px;\n  white-space: pre-wrap;\n}\n\n.voting-tool-controls[data-v-1a76a2ea] {\n  background: linear-gradient(135deg, #ffffff, #f8f9fa);\n  border: 2px solid #e6007a;\n  border-radius: 12px;\n  padding: 16px;\n  margin-bottom: 16px;\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.15);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n}\n.controls-header[data-v-1a76a2ea] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.controls-title[data-v-1a76a2ea] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #e6007a;\n  margin: 0;\n}\n.status-badge-wrapper[data-v-1a76a2ea] {\n  display: flex;\n  align-items: center;\n}\n.status-badge[data-v-1a76a2ea] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 6px 12px;\n  border-radius: 12px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  border: 1px solid rgba(255, 255, 255, 0.6);\n  transition: all 0.2s ease;\n  user-select: none;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);\n  backdrop-filter: blur(3px);\n  white-space: nowrap;\n  min-width: 100px;\n  justify-content: center;\n}\n.status-clickable[data-v-1a76a2ea] {\n  cursor: pointer;\n}\n.status-clickable[data-v-1a76a2ea]:hover {\n  transform: translateY(-1px) scale(1.02);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n  border-color: rgba(255, 255, 255, 1);\n}\n.status-icon[data-v-1a76a2ea] {\n  font-size: 0.9rem;\n}\n.edit-icon[data-v-1a76a2ea] {\n  font-size: 0.8rem;\n  opacity: 0.7;\n}\n\n/* Status color classes */\n.status-not-started[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #6c757d, #5a6268); \n  color: white;\n}\n.status-considering[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #ffc107, #e0a800); \n  color: #212529;\n}\n.status-ready-for-approval[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #17a2b8, #138496); \n  color: white;\n}\n.status-waiting-for-agreement[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #fd7e14, #e8680b); \n  color: white;\n}\n.status-ready-to-vote[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #28a745, #1e7e34); \n  color: white;\n}\n.status-reconsidering[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white;\n}\n.status-voted-----aye----[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #198754, #155724); \n  color: white;\n}\n.status-voted-----nay----[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white;\n}\n.status-voted------abstain------[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #6f42c1, #5a32a3); \n  color: white;\n}\n.status-not-voted[data-v-1a76a2ea] { \n  background: linear-gradient(135deg, #e9ecef, #dee2e6); \n  color: #495057;\n}\n.controls-actions[data-v-1a76a2ea] {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.control-btn[data-v-1a76a2ea] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 16px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n  flex: 1;\n  justify-content: center;\n  min-width: 140px;\n}\n.control-btn[data-v-1a76a2ea]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.assign-btn[data-v-1a76a2ea] {\n  background: var(--assign-gradient);\n  color: white;\n  border: 1px solid var(--assign-border);\n}\n.assign-btn[data-v-1a76a2ea]:hover:not(:disabled) {\n  background: var(--assign-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px var(--assign-shadow);\n}\n.vote-btn[data-v-1a76a2ea] {\n  background: var(--primary-gradient);\n  color: white;\n  border: 1px solid var(--primary-border);\n}\n.vote-btn[data-v-1a76a2ea]:hover:not(:disabled) {\n  background: var(--primary-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px var(--primary-shadow);\n}\n.btn-icon[data-v-1a76a2ea] {\n  font-size: 1rem;\n}\n.btn-text[data-v-1a76a2ea] {\n  font-size: 0.9rem;\n}\n\n/* Team Panel Styles */\n.team-btn[data-v-1a76a2ea] {\n  background: var(--team-gradient);\n  color: white;\n  border: 1px solid var(--team-border);\n}\n.team-btn[data-v-1a76a2ea]:hover:not(:disabled) {\n  background: var(--team-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px var(--team-shadow);\n}\n.team-panel-overlay[data-v-1a76a2ea] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.team-panel-wrapper[data-v-1a76a2ea] {\n  max-width: 90vw;\n  max-height: 90vh;\n  overflow: auto;\n}\n\n/* Removed modal styles - now in separate modal components */\n@media (max-width: 768px) {\n.controls-actions[data-v-1a76a2ea] {\n    flex-direction: column;\n}\n.control-btn[data-v-1a76a2ea] {\n    min-width: auto;\n}\n.vote-options[data-v-1a76a2ea] {\n    flex-direction: column;\n}\n.status-grid[data-v-1a76a2ea] {\n    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n}\n}\n/* OpenGov VotingTool Design System */\n/* Based on Polkassembly design patterns but platform-agnostic */\n\n:root {\n  /* Color Palette - Polkassembly-inspired */\n  --primary: #e6007a;          /* Polkadot pink */\n  --primary-dark: #b3005f;\n  --primary-light: #ff1a8c;\n  --primary-gradient: linear-gradient(135deg, var(--primary), var(--primary-dark));\n  --primary-gradient-hover: linear-gradient(135deg, var(--primary-dark), #8a0047);\n  --primary-shadow: rgba(230, 0, 122, 0.3);\n  \n  --secondary: #000000;        /* Kusama black */\n  --secondary-light: #333333;\n  --secondary-gradient: linear-gradient(135deg, var(--gray-500), var(--gray-600));\n  --secondary-gradient-hover: linear-gradient(135deg, var(--gray-600), var(--gray-700));\n  --secondary-shadow: rgba(108, 117, 125, 0.3);\n  \n  --accent: #007bff;           /* Blue accent */\n  --accent-light: #3399ff;\n  --accent-dark: #0056b3;\n  \n  /* Team Action Colors */\n  --team: #17a2b8;\n  --team-dark: #138496;\n  --team-gradient: linear-gradient(135deg, var(--team), var(--team-dark));\n  --team-gradient-hover: linear-gradient(135deg, var(--team-dark), #117a8b);\n  --team-shadow: rgba(23, 162, 184, 0.3);\n  \n  /* Assign Button Colors */\n  --assign: #28a745;\n  --assign-dark: #1e7e34;\n  --assign-gradient: linear-gradient(135deg, var(--assign), var(--assign-dark));\n  --assign-gradient-hover: linear-gradient(135deg, var(--assign-dark), #155724);\n  --assign-shadow: rgba(40, 167, 69, 0.3);\n  \n  /* Status Colors */\n  --success: var(--assign);\n  --warning: #ffc107;\n  --danger: #dc3545;\n  --info: var(--team);\n  \n  /* Status-specific Colors */\n  --status-not-started: var(--gray-500);\n  --status-considering: var(--warning);\n  --status-ready-for-approval: var(--info);\n  --status-waiting-for-agreement: #fd7e14;\n  --status-ready-to-vote: var(--success);\n  --status-reconsidering: var(--danger);\n  --status-voted-aye: #198754;\n  --status-voted-nay: var(--danger);\n  --status-voted-abstain: #6f42c1;\n  --status-not-voted: var(--gray-100);\n  \n  /* Neutral Colors */\n  --white: #ffffff;\n  --gray-50: #f8f9fa;\n  --gray-100: #e9ecef;\n  --gray-200: #dee2e6;\n  --gray-300: #ced4da;\n  --gray-400: #adb5bd;\n  --gray-500: #6c757d;\n  --gray-600: #495057;\n  --gray-700: #343a40;\n  --gray-800: #212529;\n  --gray-900: #000000;\n  \n  /* Typography */\n  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n  --font-size-xs: 0.75rem;\n  --font-size-sm: 0.875rem;\n  --font-size-base: 1rem;\n  --font-size-lg: 1.125rem;\n  --font-size-xl: 1.25rem;\n  --font-size-2xl: 1.5rem;\n  --font-size-3xl: 1.875rem;\n  \n  /* Spacing */\n  --spacing-1: 0.25rem;\n  --spacing-2: 0.5rem;\n  --spacing-3: 0.75rem;\n  --spacing-4: 1rem;\n  --spacing-5: 1.25rem;\n  --spacing-6: 1.5rem;\n  --spacing-8: 2rem;\n  --spacing-10: 2.5rem;\n  --spacing-12: 3rem;\n  --spacing-16: 4rem;\n  \n  /* Border Radius */\n  --radius-sm: 0.25rem;\n  --radius-md: 0.375rem;\n  --radius-lg: 0.5rem;\n  --radius-xl: 0.75rem;\n  --radius-2xl: 1rem;\n  --radius-3xl: 1.5rem;\n  \n  /* Shadows */\n  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n  \n  /* Z-index */\n  --z-dropdown: 1000;\n  --z-sticky: 1020;\n  --z-fixed: 1030;\n  --z-modal-backdrop: 1040;\n  --z-modal: 1050;\n  --z-popover: 1060;\n  --z-tooltip: 1070;\n  --z-overlay: 999999;\n}\n\n/* Base Styles */\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: var(--font-family);\n  line-height: 1.5;\n  color: var(--gray-800);\n}\n\n/* Typography */\n.text-xs { font-size: var(--font-size-xs); }\n.text-sm { font-size: var(--font-size-sm); }\n.text-base { font-size: var(--font-size-base); }\n.text-lg { font-size: var(--font-size-lg); }\n.text-xl { font-size: var(--font-size-xl); }\n.text-2xl { font-size: var(--font-size-2xl); }\n.text-3xl { font-size: var(--font-size-3xl); }\n\n.font-normal { font-weight: 400; }\n.font-medium { font-weight: 500; }\n.font-semibold { font-weight: 600; }\n.font-bold { font-weight: 700; }\n\n/* Buttons */\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: var(--spacing-3) var(--spacing-4);\n  border: none;\n  border-radius: var(--radius-lg);\n  font-size: var(--font-size-sm);\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n\n.btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.btn-primary {\n  background: var(--primary-gradient);\n  color: var(--white);\n  border: 1px solid var(--primary-dark);\n}\n\n.btn-primary:hover:not(:disabled) {\n  background: var(--primary-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 0 10px var(--primary-shadow);\n}\n\n.btn-secondary {\n  background: var(--secondary-gradient);\n  color: var(--white);\n  border: 1px solid var(--gray-600);\n}\n\n.btn-secondary:hover:not(:disabled) {\n  background: var(--secondary-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 0 10px var(--secondary-shadow);\n}\n\n.btn-team {\n  background: var(--team-gradient);\n  color: var(--white);\n  border: 1px solid var(--team-dark);\n}\n\n.btn-team:hover:not(:disabled) {\n  background: var(--team-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 0 10px var(--team-shadow);\n}\n\n.btn-assign {\n  background: var(--assign-gradient);\n  color: var(--white);\n  border: 1px solid var(--assign-dark);\n}\n\n.btn-assign:hover:not(:disabled) {\n  background: var(--assign-gradient-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 0 10px var(--assign-shadow);\n}\n\n.btn-outline {\n  background: transparent;\n  color: var(--primary);\n  border: 2px solid var(--primary);\n}\n\n.btn-outline:hover:not(:disabled) {\n  background: var(--primary-gradient);\n  color: var(--white);\n}\n\n/* Status-specific buttons */\n.btn-status {\n  font-weight: 600;\n  padding: var(--spacing-2) var(--spacing-4);\n  border-radius: var(--radius-lg);\n  transition: all 0.2s ease;\n}\n\n.btn-status-not-started { background: var(--status-not-started); color: var(--white); }\n.btn-status-considering { background: var(--status-considering); color: var(--gray-900); }\n.btn-status-ready-for-approval { background: var(--status-ready-for-approval); color: var(--white); }\n.btn-status-waiting-for-agreement { background: var(--status-waiting-for-agreement); color: var(--white); }\n.btn-status-ready-to-vote { background: var(--status-ready-to-vote); color: var(--white); }\n.btn-status-reconsidering { background: var(--status-reconsidering); color: var(--white); }\n.btn-status-voted-aye { background: var(--status-voted-aye); color: var(--white); }\n.btn-status-voted-nay { background: var(--status-voted-nay); color: var(--white); }\n.btn-status-voted-abstain { background: var(--status-voted-abstain); color: var(--white); }\n.btn-status-not-voted { background: var(--status-not-voted); color: var(--gray-900); }\n\n/* Cards */\n.card {\n  background: var(--white);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-lg);\n  overflow: hidden;\n}\n\n.card-header {\n  padding: var(--spacing-6);\n  border-bottom: 1px solid var(--gray-200);\n  background: var(--gray-50);\n}\n\n.card-body {\n  padding: var(--spacing-6);\n}\n\n.card-footer {\n  padding: var(--spacing-6);\n  border-top: 1px solid var(--gray-200);\n  background: var(--gray-50);\n}\n\n/* Badges */\n.badge {\n  display: inline-flex;\n  align-items: center;\n  padding: var(--spacing-1) var(--spacing-2);\n  border-radius: var(--radius-2xl);\n  font-size: var(--font-size-xs);\n  font-weight: 600;\n  text-align: center;\n  white-space: nowrap;\n}\n\n.badge-primary { background: var(--primary); color: var(--white); }\n.badge-secondary { background: var(--secondary); color: var(--white); }\n.badge-accent { background: var(--accent); color: var(--white); }\n.badge-success { background: var(--success); color: var(--white); }\n.badge-warning { background: var(--warning); color: var(--gray-800); }\n.badge-danger { background: var(--danger); color: var(--white); }\n.badge-info { background: var(--info); color: var(--white); }\n\n/* Forms */\n.form-group {\n  margin-bottom: var(--spacing-4);\n}\n\n.form-label {\n  display: block;\n  margin-bottom: var(--spacing-2);\n  font-weight: 600;\n  color: var(--gray-700);\n}\n\n.form-control {\n  width: 100%;\n  padding: var(--spacing-3);\n  border: 2px solid var(--gray-300);\n  border-radius: var(--radius-lg);\n  font-size: var(--font-size-base);\n  transition: border-color 0.2s ease, box-shadow 0.2s ease;\n}\n\n.form-control:focus {\n  outline: none;\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px var(--primary-shadow);\n}\n\n.form-control:disabled {\n  background-color: var(--gray-100);\n  color: var(--gray-500);\n}\n\n/* Modals */\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: var(--z-modal-backdrop);\n}\n\n.modal {\n  background: var(--white);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-xl);\n  width: 90%;\n  max-width: 500px;\n  max-height: 90vh;\n  overflow-y: auto;\n  z-index: var(--z-modal);\n}\n\n.modal-header {\n  padding: var(--spacing-4) var(--spacing-6);\n  border-bottom: 1px solid var(--gray-200);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.modal-header h3 {\n  margin: 0;\n  font-size: var(--font-size-xl);\n  color: var(--gray-900);\n}\n\n.modal-content {\n  padding: var(--spacing-6);\n}\n\n.modal-footer {\n  padding: var(--spacing-4) var(--spacing-6);\n  border-top: 1px solid var(--gray-200);\n  display: flex;\n  justify-content: flex-end;\n  gap: var(--spacing-3);\n}\n\n.close-btn {\n  background: transparent;\n  border: none;\n  font-size: var(--font-size-xl);\n  color: var(--gray-500);\n  cursor: pointer;\n  padding: var(--spacing-1) var(--spacing-2);\n  border-radius: var(--radius-md);\n  transition: all 0.2s ease;\n}\n\n.close-btn:hover {\n  color: var(--gray-700);\n  background: var(--gray-100);\n}\n\n/* Component-specific Modals */\n.assign-modal,\n.unassign-modal {\n  background: var(--white);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-xl);\n  width: 90%;\n  max-width: 500px;\n  max-height: 90vh;\n  overflow-y: auto;\n  z-index: var(--z-modal);\n}\n\n.assign-modal .modal-content,\n.unassign-modal .modal-content {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-4);\n}\n\n.assign-modal .form-group,\n.unassign-modal .form-group {\n  margin-bottom: 0;\n}\n\n.assign-modal .error-message,\n.unassign-modal .error-message {\n  color: var(--danger);\n  font-size: var(--font-size-sm);\n  margin-top: var(--spacing-2);\n  padding: var(--spacing-2);\n  background: rgba(220, 53, 69, 0.1);\n  border-radius: var(--radius-md);\n}\n\n.assign-modal .old-value,\n.unassign-modal .old-value {\n  color: var(--gray-500);\n  text-decoration: line-through;\n}\n\n.assign-modal .new-value,\n.unassign-modal .new-value {\n  color: var(--success);\n  font-weight: 600;\n}\n\n/* Settings Panel */\n.settings-panel {\n  background: var(--white);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-lg);\n  overflow: hidden;\n}\n\n.settings-panel-header {\n  padding: var(--spacing-4) var(--spacing-6);\n  background: var(--gray-50);\n  border-bottom: 1px solid var(--gray-200);\n}\n\n.settings-panel-content {\n  padding: var(--spacing-6);\n}\n\n.settings-panel-footer {\n  padding: var(--spacing-4) var(--spacing-6);\n  background: var(--gray-50);\n  border-top: 1px solid var(--gray-200);\n  border-bottom-left-radius: var(--radius-xl);\n  border-bottom-right-radius: var(--radius-xl);\n}\n\n/* Utilities */\n.text-center { text-align: center; }\n.text-left { text-align: left; }\n.text-right { text-align: right; }\n\n.mt-1 { margin-top: var(--spacing-1); }\n.mt-2 { margin-top: var(--spacing-2); }\n.mt-3 { margin-top: var(--spacing-3); }\n.mt-4 { margin-top: var(--spacing-4); }\n.mt-5 { margin-top: var(--spacing-5); }\n.mt-6 { margin-top: var(--spacing-6); }\n\n.mb-1 { margin-bottom: var(--spacing-1); }\n.mb-2 { margin-bottom: var(--spacing-2); }\n.mb-3 { margin-bottom: var(--spacing-3); }\n.mb-4 { margin-bottom: var(--spacing-4); }\n.mb-5 { margin-bottom: var(--spacing-5); }\n.mb-6 { margin-bottom: var(--spacing-6); }\n\n.p-1 { padding: var(--spacing-1); }\n.p-2 { padding: var(--spacing-2); }\n.p-3 { padding: var(--spacing-3); }\n.p-4 { padding: var(--spacing-4); }\n.p-5 { padding: var(--spacing-5); }\n.p-6 { padding: var(--spacing-6); }\n\n/* Responsive */\n@media (max-width: 768px) {\n  .btn {\n    width: 100%;\n    justify-content: center;\n  }\n  \n  .card-header,\n  .card-body,\n  .card-footer {\n    padding: var(--spacing-4);\n  }\n} /*$vite$:1*/";
  document.head.appendChild(__vite_style__);
  /**
  * @vue/shared v3.5.20
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : {});
  };
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  function looseCompareArrays(a, b) {
    if (a.length !== b.length) return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b) return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }
  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };
  /**
  * @vue/reactivity v3.5.20
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this._on = 0;
      this.effects = [];
      this.cleanups = [];
      this._isPaused = false;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
      }
    }
    /**
     * Resumes the effect scope, including all child scopes and effects.
     */
    resume() {
      if (this._active) {
        if (this._isPaused) {
          this._isPaused = false;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
        }
      }
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      if (++this._on === 1) {
        this.prevScope = activeEffectScope;
        activeEffectScope = this;
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      if (this._on > 0 && --this._on === 0) {
        activeEffectScope = this.prevScope;
        this.prevScope = void 0;
      }
    }
    stop(fromParent) {
      if (this._active) {
        this._active = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
      }
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  let activeSub;
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= -65;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
  function batch(sub, isComputed = false) {
    sub.flags |= 8;
    if (isComputed) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        e = next;
      }
    }
    let error;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
        }
        e = next;
      }
    }
    if (error) throw error;
  }
  function prepareDeps(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      link.version = -1;
      link.prevActiveLink = link.dep.activeLink;
      link.dep.activeLink = link;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link = tail;
    while (link) {
      const prev = link.prevDep;
      if (link.version === -1) {
        if (link === tail) tail = prev;
        removeSub(link);
        removeDep(link);
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed2) {
    if (computed2.flags & 4 && !(computed2.flags & 16)) {
      return;
    }
    computed2.flags &= -17;
    if (computed2.globalVersion === globalVersion) {
      return;
    }
    computed2.globalVersion = globalVersion;
    if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
      return;
    }
    computed2.flags |= 2;
    const dep = computed2.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed2;
    shouldTrack = true;
    try {
      prepareDeps(computed2);
      const value = computed2.fn(computed2._value);
      if (dep.version === 0 || hasChanged(value, computed2._value)) {
        computed2.flags |= 128;
        computed2._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed2);
      computed2.flags &= -3;
    }
  }
  function removeSub(link, soft = false) {
    const { dep, prevSub, nextSub } = link;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.nextSub = void 0;
    }
    if (dep.subs === link) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= -5;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link) {
    const { prevDep, nextDep } = link;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link.nextDep = void 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }
  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    // TODO isolatedDeclarations "__v_skip"
    constructor(computed2) {
      this.computed = computed2;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
      this.__v_skip = true;
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
          link.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
        }
        addSub(link);
      } else if (link.version === -1) {
        link.version = this.version;
        if (link.nextDep) {
          const next = link.nextDep;
          next.prevDep = link.prevDep;
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
        }
      }
      return link;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (false) ;
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed2 = link.dep.computed;
      if (computed2 && !link.dep.subs) {
        computed2.flags |= 4 | 16;
        for (let l = computed2.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      link.dep.subs = link;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol(
    ""
  );
  const MAP_KEY_ITERATE_KEY = Symbol(
    ""
  );
  const ARRAY_ITERATE_KEY = Symbol(
    ""
  );
  function track(target, type, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track();
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        {
          dep.trigger();
        }
      }
    };
    startBatch();
    if (type === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = isArray(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function reactiveReadArray(array) {
    const raw = toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    return isShallow(array) ? raw : raw.map(toReactive);
  }
  function shallowReadArray(arr) {
    track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, toReactive);
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
      );
    },
    entries() {
      return iterator(this, "entries", (value) => {
        value[1] = toReactive(value[1]);
        return value;
      });
    },
    every(fn, thisArg) {
      return apply(this, "every", fn, thisArg, void 0, arguments);
    },
    filter(fn, thisArg) {
      return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
    },
    find(fn, thisArg) {
      return apply(this, "find", fn, thisArg, toReactive, arguments);
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(this, "findLast", fn, thisArg, toReactive, arguments);
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn, thisArg) {
      return apply(this, "forEach", fn, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimization required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn, thisArg) {
      return apply(this, "map", fn, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn, ...args) {
      return reduce(this, "reduce", fn, args);
    },
    reduceRight(fn, ...args) {
      return reduce(this, "reduceRight", fn, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn, thisArg) {
      return apply(this, "some", fn, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator(this, "values", toReactive);
    }
  };
  function iterator(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (result.value) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item, index) {
          return fn.call(this, toReactive(item), index, self2);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item, index) {
          return fn.call(this, item, index, self2);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce(self2, method, fn, args) {
    const arr = shallowReadArray(self2);
    let wrappedFn = fn;
    if (arr !== self2) {
      if (!isShallow(self2)) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, toReactive(item), index, self2);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, item, index, self2);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self2, method, args) {
    const arr = toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && isProxy(args[0])) {
      args[0] = toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res = toRaw(self2)[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res;
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && isIntegerKey(key) ? res : res.value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            return true;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        isRef(target) ? target : receiver
      );
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      return true;
    }
    deleteProperty(target, key) {
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return target.size;
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const proto = getProto(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
          return this;
        },
        delete(key) {
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          get ? get.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0);
          }
          return result;
        },
        clear() {
          const target = toRaw(this);
          const hadItems = target.size !== 0;
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  function ref(value) {
    return createRef(value, false);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      {
        this.dep.track();
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
      newValue = useDirectValue ? newValue : toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        {
          this.dep.trigger();
        }
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class ComputedRefImpl {
    constructor(fn, setter, isSSR) {
      this.fn = fn;
      this.setter = setter;
      this._value = void 0;
      this.dep = new Dep(this);
      this.__v_isRef = true;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 16;
      this.globalVersion = globalVersion - 1;
      this.next = void 0;
      this.effect = this;
      this["__v_isReadonly"] = !setter;
      this.isSSR = isSSR;
    }
    /**
     * @internal
     */
    notify() {
      this.flags |= 16;
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link = this.dep.track();
      refreshComputed(this);
      if (link) {
        link.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      }
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    return cRef;
  }
  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    }
  }
  function watch$1(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return call ? call(s, 2) : s();
        } else ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect2);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle();
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  /**
  * @vue/runtime-core v3.5.20
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const stack = [];
  let isWarning = false;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = true;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a, _b;
            return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
    isWarning = false;
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
    if (throwInProd) {
      throw err;
    } else {
      console.error(err);
    }
  }
  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= -2;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (false) ;
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs();
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs();
      }
    }
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      return vnode;
    }
    const instance = getComponentPublicInstance(currentRenderingInstance);
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  const TeleportEndKey = Symbol("_vte");
  const isTeleport = (type) => type.__isTeleport;
  const leaveCbKey = Symbol("_leaveCb");
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = toRaw(setupState);
    const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
      return hasOwn(rawSetupState, key);
    };
    if (oldRef != null && oldRef !== ref3) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        {
          oldRef.value = null;
        }
        const oldRawRefAtom = oldRawRef;
        if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
      }
    }
    if (isFunction(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref3);
      const _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref3] = [refValue];
                  if (canSetSetupRef(ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  const newVal = [refValue];
                  {
                    ref3.value = newVal;
                  }
                  if (rawRef.k) refs[rawRef.k] = newVal;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (canSetSetupRef(ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            {
              ref3.value = value;
            }
            if (rawRef.k) refs[rawRef.k] = value;
          } else ;
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      }
    }
  }
  getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache;
    const sourceIsArray = isArray(source);
    if (sourceIsArray || isString(source)) {
      const sourceIsReactiveArray = sourceIsArray && isReactive(source);
      let needsWrap = false;
      let isReadonlySource = false;
      if (sourceIsReactiveArray) {
        needsWrap = !isShallow(source);
        isReadonlySource = isReadonly(source);
        source = shallowReadArray(source);
      }
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
          i,
          void 0,
          cached
        );
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached)
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => i.props,
      $attrs: (i) => i.attrs,
      $slots: (i) => i.slots,
      $refs: (i) => i.refs,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    })
  );
  const hasSetupBinding = (state2, key) => state2 !== EMPTY_OBJ && !state2.__isScriptSetup && hasOwn(state2, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
        ) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, propsOptions, type }
    }, key) {
      let normalizedProps, cssModules;
      return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props;
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!isObject(data)) ;
      else {
        instance.data = reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        const c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val,
            enumerable: true
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
    if (serverPrefetch) {
      markAsyncBoundary(instance);
    }
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook(hook, instance, type) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        {
          watch(getter, handler);
        }
      }
    } else if (isFunction(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        }
      }
    } else ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray(to) && isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else ;
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app;
        },
        component(name, component) {
          if (!component) {
            return context.components[name];
          }
          context.components[name] = component;
          return app;
        },
        directive(name, directive) {
          if (!directive) {
            return context.directives[name];
          }
          context.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            {
              render(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            return getComponentPublicInstance(vnode.component);
          }
        },
        onUnmount(cleanupFn) {
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            render(null, app._container);
            delete app._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    if (!currentInstance) ;
    else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else ;
    }
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys) needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          }
          prop[
            0
            /* shouldCast */
          ] = shouldCast;
          prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    }
    return false;
  }
  const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (false) ;
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || !isInternalKey(key)) {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          def(slots, "_", type, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref3, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else ;
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      } else if (ref3 == null && n1 && n1.ref != null) {
        setRef(n1.ref, null, parentSuspense, n1, true);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, parentComponent);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          if (
            // #2080 if the stable fragment has a key, it's a <template v-for> that may
            //  get moved around. Make sure all root level vnodes inherit el.
            // #2134 or if it's a component root, it may also get moved around
            // as the component is being moved.
            n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
              /* shallow */
            );
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance, false, optimized);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
          initialVNode.placeholder = placeholder.el;
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent, root, type } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          {
            if (root.ce && // @ts-expect-error _def is private
            root.ce._def.shadowRoot !== false) {
              root.ce._injectChildStyle(type);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
        }
      };
      instance.scope.on();
      const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect2.run.bind(effect2);
      const job = instance.job = effect2.runIfDirty.bind(effect2);
      job.i = instance;
      job.id = instance.uid;
      effect2.scheduler = () => queueJob(job);
      toggleRecurse(instance, true);
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchorVNode = c2[nextIndex + 1];
          const anchor = nextIndex + 1 < l2 ? (
            // #13559, fallback to el placeholder for unresolved async component
            anchorVNode.el || anchorVNode.placeholder
          ) : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => {
            if (vnode.ctx.isUnmounted) {
              hostRemove(el);
            } else {
              hostInsert(el, container, anchor);
            }
          };
          const performLeave = () => {
            if (el._isLeaving) {
              el[leaveCbKey](
                true
                /* cancelled */
              );
            }
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref3 != null) {
        pauseTracking();
        setRef(ref3, null, parentSuspense, vnode, true);
        resetTracking();
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      const { bum, scope, job, subTree, um, m, a } = instance;
      invalidateMount(m);
      invalidateMount(a);
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      const el = hostNextSibling(vnode.anchor || vnode.el);
      const teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    };
    let isFlushing = false;
    const render = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      container._vnode = vnode;
      if (!isFlushing) {
        isFlushing = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing = false;
      }
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    return {
      render,
      hydrate,
      createApp: createAppAPI(render)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, job }, allowed) {
    if (allowed) {
      effect2.flags |= 32;
      job.flags |= 4;
    } else {
      effect2.flags &= -33;
      job.flags &= -5;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text && // avoid cached text nodes retaining detached dom nodes
        c2.patchFlag !== -1) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    const baseWatchOptions = extend({}, options);
    const runsImmediately = cb && immediate || !cb && flush !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = watch$1(source, cb, baseWatchOptions);
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  const getModelModifiers = (props, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
  };
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = false ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render.call(
            thisProxy,
            proxyToUse,
            renderCache,
            false ? shallowReadonly(props) : props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (false) ;
        result = normalizeVNode(
          render2.length > 1 ? render2(
            false ? shallowReadonly(props) : props,
            false ? {
              get attrs() {
                markAttrsAccessed();
                return shallowReadonly(attrs);
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render2(
            false ? shallowReadonly(props) : props,
            null
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        }
      }
    }
    if (vnode.dirs) {
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      setTransitionHooks(root, vnode.transition);
    }
    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref: ref3,
    ref_key,
    ref_for
  }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style)) {
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props) return null;
    return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref: ref3, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      placeholder: vnode.placeholder,
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createStaticVNode(content, numberOfNodes) {
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g[key])) setters = g[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false, optimized = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children, optimized || isSSR);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
      pauseTracking();
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          instance.props,
          setupContext
        ]
      );
      const isAsyncSetup = isPromise(setupResult);
      resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult);
      }
    } else {
      finishComponentSetup(instance);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
    } else ;
    finishComponentSetup(instance);
  }
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      instance.render = Component.render || NOOP;
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      track(target, "get", "");
      return target[key];
    }
  };
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    {
      return {
        attrs: new Proxy(instance.attrs, attrsProxyHandlers),
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(
        instance.components || instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    return c;
  };
  const version = "3.5.20";
  /**
  * @vue/runtime-dom v3.5.20
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let policy = void 0;
  const tt = typeof window !== "undefined" && window.trustedTypes;
  if (tt) {
    try {
      policy = /* @__PURE__ */ tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling)) break;
        }
      } else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
        );
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const vtcKey = Symbol("_vtc");
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const CSS_VAR_TEXT = Symbol("");
  const displayRE = /(^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null) val = "";
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(
          key,
          isBoolean ? "" : isSymbol(value) ? String(value) : value
        );
      }
    }
  }
  function patchDOMProp(el, key, value, parentComponent, attrName) {
    if (key === "innerHTML" || key === "textContent") {
      if (value != null) {
        el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
      }
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (
        // #11647: value should be set as empty string for null and undefined,
        // but <input type="checkbox"> should be set as 'on'.
        el.type === "checkbox" ? "on" : ""
      ) : String(value);
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
    needRemove && el.removeAttribute(attrName || key);
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          nextValue,
          instance
        );
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map(
        (fn) => (e2) => !e2._stopped && fn && fn(e2)
      );
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue);
      if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
        patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
      }
    } else if (
      // #11081 force set props for possible async custom element
      el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
    ) {
      patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const assignKey = Symbol("_assign");
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing) return;
        let domValue = el.value;
        if (trim) {
          domValue = domValue.trim();
        }
        if (castToNumber) {
          domValue = looseToNumber(domValue);
        }
        el[assignKey](domValue);
      });
      if (trim) {
        addEventListener(el, "change", () => {
          el.value = el.value.trim();
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing) return;
      const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy && value === oldValue) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const vModelSelect = {
    // <select multiple> value need to be deep traversed
    deep: true,
    created(el, { value, modifiers: { number } }, vnode) {
      const isSetModel = isSet(value);
      addEventListener(el, "change", () => {
        const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
          (o) => number ? looseToNumber(getValue(o)) : getValue(o)
        );
        el[assignKey](
          el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
        );
        el._assigning = true;
        nextTick(() => {
          el._assigning = false;
        });
      });
      el[assignKey] = getModelAssigner(vnode);
    },
    // set value in mounted & updated because <select> relies on its children
    // <option>s.
    mounted(el, { value }) {
      setSelected(el, value);
    },
    beforeUpdate(el, _binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
    },
    updated(el, { value }) {
      if (!el._assigning) {
        setSelected(el, value);
      }
    }
  };
  function setSelected(el, value) {
    const isMultiple = el.multiple;
    const isArrayValue = isArray(value);
    if (isMultiple && !isArrayValue && !isSet(value)) {
      return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
      const option = el.options[i];
      const optionValue = getValue(option);
      if (isMultiple) {
        if (isArrayValue) {
          const optionType = typeof optionValue;
          if (optionType === "string" || optionType === "number") {
            option.selected = value.some((v) => String(v) === String(optionValue));
          } else {
            option.selected = looseIndexOf(value, optionValue) > -1;
          }
        } else {
          option.selected = value.has(optionValue);
        }
      } else if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) el.selectedIndex = i;
        return;
      }
    }
    if (!isMultiple && el.selectedIndex !== -1) {
      el.selectedIndex = -1;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn, modifiers) => {
    const cache = fn._withMods || (fn._withMods = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers)) return;
      }
      return fn(event, ...args);
    });
  };
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp = (...args) => {
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      if (container.nodeType === 1) {
        container.textContent = "";
      }
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  };
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  const _ApiService = class _ApiService {
    constructor() {
      __publicField(this, "baseUrl");
      __publicField(this, "token", null);
      this.baseUrl = "http://localhost:3000";
      this.loadToken();
      this.loadApiConfig();
      this.setupConfigListener();
    }
    async loadApiConfig() {
      try {
        const result = await chrome.storage.sync.get(["backendUrl"]);
        if (result.backendUrl) {
          this.baseUrl = result.backendUrl;
        }
      } catch (error) {
        console.warn("ApiService: Failed to load API config, using default:", error);
      }
    }
    setupConfigListener() {
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "sync" && changes.backendUrl) {
          this.baseUrl = changes.backendUrl.newValue;
        }
      });
      window.addEventListener("backend-url-changed", (event) => {
        const customEvent = event;
        this.baseUrl = customEvent.detail.url;
      });
    }
    static getInstance() {
      if (!_ApiService.instance) {
        _ApiService.instance = new _ApiService();
      }
      return _ApiService.instance;
    }
    loadToken() {
      this.token = localStorage.getItem("opengov-auth-token");
      console.log("🔑 Loaded token:", this.token ? "Present" : "Not found");
    }
    // Method to refresh token from localStorage
    refreshToken() {
      this.loadToken();
    }
    saveToken(token) {
      this.token = token;
      localStorage.setItem("opengov-auth-token", token);
    }
    getHeaders() {
      const headers = {
        "Content-Type": "application/json"
      };
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }
      return headers;
    }
    async request(endpoint, options = {}) {
      return new Promise((resolve, reject) => {
        const headers = __spreadValues(__spreadValues({}, this.getHeaders()), options.headers);
        const messageId = Date.now().toString();
        chrome.runtime.sendMessage({
          type: "VOTING_TOOL_API_CALL",
          messageId,
          endpoint,
          method: options.method || "GET",
          data: options.body ? JSON.parse(options.body) : void 0,
          headers
        }, (response) => {
          var _a, _b, _c, _d;
          if (chrome.runtime.lastError) {
            console.error("❌ API Service: Chrome runtime error:", chrome.runtime.lastError);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          console.log("📡 Chrome message response:", response);
          if (response && response.success) {
            console.log("✅ API call successful, raw response:", response);
            resolve(response.data);
          } else {
            console.error("❌ API Service: API call failed, response:", response);
            if (((_a = response == null ? void 0 : response.debugInfo) == null ? void 0 : _a.responseStatus) === 401) {
              console.warn("⚠️ Unauthorized - clearing token");
              this.token = null;
              localStorage.removeItem("opengov-auth-token");
            }
            const error = new Error((response == null ? void 0 : response.error) || "API call failed");
            if ((_c = (_b = response == null ? void 0 : response.debugInfo) == null ? void 0 : _b.errorResponseBody) == null ? void 0 : _c.details) {
              error.details = response.debugInfo.errorResponseBody.details;
              error.status = (_d = response == null ? void 0 : response.debugInfo) == null ? void 0 : _d.responseStatus;
            }
            console.error("❌ Rejecting with error:", error);
            reject(error);
          }
        });
      });
    }
    // Authentication methods
    async authenticate(address, signature, message) {
      try {
        const result = await this.request("/auth/authenticate", {
          method: "POST",
          body: JSON.stringify({
            address,
            signature,
            message,
            timestamp: Date.now()
          })
        });
        if (result.success && result.token) {
          this.saveToken(result.token);
        }
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Authentication failed" };
      }
    }
    async verifyToken() {
      try {
        const result = await this.request("/auth/verify");
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Token verification failed" };
      }
    }
    // Proposal CRUD methods
    async getProposal(postId, chain) {
      try {
        const result = await this.request(`/referendums/${postId}?chain=${chain}`);
        return result.referendum || null;
      } catch (error) {
        console.error("Failed to fetch proposal:", error);
        return null;
      }
    }
    async updateProposalStatus(postId, chain, status) {
      try {
        console.log(`🔄 Updating status: PUT /referendums/${postId}/${chain}`, { internal_status: status });
        console.log(`🔐 Auth token present: ${!!this.token}`);
        const updatedReferendum = await this.request(`/referendums/${postId}/${chain}`, {
          method: "PUT",
          body: JSON.stringify({
            internal_status: status
          })
        });
        console.log("✅ Status update result:", updatedReferendum);
        if (updatedReferendum && updatedReferendum.internal_status === status) {
          return { success: true };
        } else {
          return { success: false, error: "Status update did not apply correctly" };
        }
      } catch (error) {
        console.error("❌ Status update error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
      }
    }
    async assignProposal(postId, chain) {
      try {
        const result = await this.request(`/referendums/${postId}/assign`, {
          method: "POST",
          body: JSON.stringify({ chain })
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to assign proposal" };
      }
    }
    async updateSuggestedVote(postId, chain, vote, reason) {
      try {
        const result = await this.request(`/referendums/${postId}/${chain}`, {
          method: "PUT",
          body: JSON.stringify({
            suggested_vote: vote,
            reason_for_vote: reason
            // Store reason in referendums table
          })
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to update suggested vote");
        }
        return { success: true };
      } catch (error) {
        console.error("Failed to update suggested vote:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update suggested vote" };
      }
    }
    async updateFinalVote(postId, chain, vote, reason) {
      try {
        const result = await this.request(`/referendums/${postId}/${chain}`, {
          method: "PUT",
          body: JSON.stringify({
            final_vote: vote,
            reason_for_vote: reason
          })
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to update vote" };
      }
    }
    // New team collaboration methods
    async submitTeamAction(postId, chain, action, reason) {
      try {
        const actionMap = {
          "Agree": "agree",
          "To be discussed": "to_be_discussed",
          "NO WAY": "no_way",
          "Recuse": "recuse"
        };
        const backendAction = actionMap[action];
        if (!backendAction) {
          return { success: false, error: `Unknown action: ${action}` };
        }
        console.log("🔄 Submitting team action:", {
          postId,
          chain,
          action,
          backendAction,
          reason
        });
        const result = await this.request(`/referendums/${postId}/actions`, {
          method: "POST",
          body: JSON.stringify({
            chain,
            action: backendAction,
            reason
          })
        });
        console.log("✅ Team action result:", result);
        return result;
      } catch (error) {
        console.error("❌ Failed to submit team action:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to submit team action" };
      }
    }
    async deleteTeamAction(postId, chain, action) {
      try {
        const actionMap = {
          "Agree": "agree",
          "To be discussed": "to_be_discussed",
          "NO WAY": "no_way",
          "Recuse": "recuse"
        };
        const backendAction = actionMap[action];
        if (!backendAction) {
          return { success: false, error: `Unknown action: ${action}` };
        }
        const result = await this.request(`/referendums/${postId}/actions`, {
          method: "DELETE",
          body: JSON.stringify({
            chain,
            action: backendAction
          })
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to delete team action");
        }
        return result;
      } catch (error) {
        console.error("❌ Failed to delete team action:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete team action" };
      }
    }
    async unassignFromReferendum(postId, chain, unassignNote) {
      try {
        const result = await this.request(`/referendums/${postId}/unassign`, {
          method: "POST",
          body: JSON.stringify({
            chain,
            unassignNote
          })
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to unassign from referendum");
        }
        return result;
      } catch (error) {
        console.error("❌ Failed to unassign from referendum:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to unassign from referendum" };
      }
    }
    async getTeamActions(postId, chain) {
      try {
        const result = await this.request(
          `/referendums/${postId}/actions?chain=${chain}`
        );
        if (!result.success) {
          console.error("Failed to fetch team actions:", result.error);
          return [];
        }
        const mappedActions = (result.actions || []).map((action) => __spreadProps(__spreadValues({}, action), {
          role_type: this.mapBackendActionToFrontend(action.role_type)
        }));
        console.log("📝 Team actions loaded:", {
          postId,
          chain,
          rawActions: result.actions,
          mappedActions
        });
        return mappedActions;
      } catch (error) {
        console.error("Failed to fetch team actions:", error);
        return [];
      }
    }
    async getAgreementSummary(postId, chain) {
      var _a;
      try {
        const actions = await this.getTeamActions(postId, chain);
        if (!actions) {
          return null;
        }
        const daoConfig = await this.getDAOConfig();
        if (!daoConfig) {
          return null;
        }
        const agreed_members = actions.filter((a) => a.role_type === "Agree").map((a) => {
          var _a2;
          return {
            address: a.team_member_id,
            name: a.team_member_name || ((_a2 = daoConfig.team_members.find((m) => m.address === a.team_member_id)) == null ? void 0 : _a2.name) || a.team_member_id
          };
        });
        const recused_members = actions.filter((a) => a.role_type === "Recuse").map((a) => {
          var _a2;
          return {
            address: a.team_member_id,
            name: a.team_member_name || ((_a2 = daoConfig.team_members.find((m) => m.address === a.team_member_id)) == null ? void 0 : _a2.name) || a.team_member_id
          };
        });
        const to_be_discussed_members = actions.filter((a) => a.role_type === "To be discussed").map((a) => {
          var _a2;
          return {
            address: a.team_member_id,
            name: a.team_member_name || ((_a2 = daoConfig.team_members.find((m) => m.address === a.team_member_id)) == null ? void 0 : _a2.name) || a.team_member_id
          };
        });
        const vetoAction = actions.find((a) => a.role_type === "NO WAY");
        const vetoed = !!vetoAction;
        const veto_by = vetoed ? vetoAction.team_member_name || ((_a = daoConfig.team_members.find((m) => m.address === vetoAction.team_member_id)) == null ? void 0 : _a.name) || vetoAction.team_member_id : null;
        const veto_reason = vetoed ? vetoAction.reason : null;
        const actionTakers = /* @__PURE__ */ new Set([
          ...agreed_members.map((m) => m.address),
          ...recused_members.map((m) => m.address),
          ...to_be_discussed_members.map((m) => m.address),
          ...vetoed && vetoAction ? [vetoAction.team_member_id] : []
        ]);
        const pending_members = daoConfig.team_members.filter((m) => !actionTakers.has(m.address)).map((m) => ({
          address: m.address,
          name: m.name
        }));
        return {
          total_agreements: agreed_members.length,
          required_agreements: daoConfig.required_agreements,
          agreed_members,
          pending_members,
          recused_members,
          to_be_discussed_members,
          vetoed,
          veto_by,
          veto_reason
        };
      } catch (error) {
        console.error("Failed to fetch agreement summary:", error);
        return null;
      }
    }
    async addComment(postId, chain, content) {
      try {
        const result = await this.request(`/referendums/${postId}/comments`, {
          method: "POST",
          body: JSON.stringify({
            chain,
            content
          })
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to add comment" };
      }
    }
    async getComments(postId, chain) {
      try {
        const result = await this.request(`/referendums/${postId}/comments?chain=${chain}`);
        return result.comments || [];
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        return [];
      }
    }
    async deleteComment(commentId) {
      try {
        const result = await this.request(`/comments/${commentId}`, {
          method: "DELETE"
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete comment" };
      }
    }
    // DAO configuration methods
    async getDAOConfig() {
      try {
        const membersResult = await this.request("/dao/members").catch((error) => {
          console.warn("Failed to get members from /dao/members:", error);
          return { success: false, error: error instanceof Error ? error.message : "Failed to get members" };
        });
        if (!membersResult.success || !membersResult.members) {
          console.error("Failed to get team members:", membersResult.error);
          return null;
        }
        const requiredAgreements = membersResult.members.length > 0 ? Math.ceil(membersResult.members.length / 2) : 4;
        const config = {
          team_members: membersResult.members,
          required_agreements: requiredAgreements,
          name: "OpenGov Voting Tool"
        };
        return config;
      } catch (error) {
        console.error("Error getting DAO config:", error);
        return null;
      }
    }
    // Removed deprecated methods:
    // - updateDAOConfig (config is now calculated from team members)
    // - triggerSync (sync is now handled automatically by the backend)
    // List methods for different views
    async getMyAssignments() {
      try {
        const result = await this.request("/dao/my-assignments");
        if (!result.success) {
          console.warn("API returned success: false", result.error);
          return [];
        }
        return result.referendums || [];
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        return [];
      }
    }
    async getProposalsByStatus(status) {
      try {
        const result = await this.request(`/referendums?status=${encodeURIComponent(status)}`);
        return result.referendums || [];
      } catch (error) {
        console.error("Failed to fetch proposals by status:", error);
        return [];
      }
    }
    async getAllProposals(chain) {
      try {
        console.log("🔍 getAllProposals called", { chain, baseUrl: this.baseUrl, hasToken: !!this.token });
        const queryParam = chain ? `?chain=${chain}` : "";
        const endpoint = `/referendums${queryParam}`;
        console.log("📡 Making request to:", endpoint);
        const result = await this.request(endpoint);
        console.log("📦 Raw API result:", result);
        if (!result.success) {
          console.warn("⚠️ API returned success: false");
          return [];
        }
        if (result.referendums.length > 0) {
          console.log("📝 First proposal structure:", {
            proposal: result.referendums[0],
            keys: Object.keys(result.referendums[0]),
            hasTeamActions: "team_actions" in result.referendums[0],
            teamActionsType: result.referendums[0].team_actions ? typeof result.referendums[0].team_actions : "undefined"
          });
        }
        const sampleProposal = result.referendums[0];
        if (sampleProposal) {
          console.log("🔍 Looking for team actions in proposal keys:", Object.keys(sampleProposal));
          Object.entries(sampleProposal).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              console.log(`📦 Array found in key "${key}":`, value);
            }
          });
        }
        const proposalsWithActions = result.referendums.filter((p2) => {
          const hasActions = p2.team_actions && p2.team_actions.length > 0;
          if (!hasActions && p2.team_actions !== void 0) {
            console.log(`⚠️ Proposal ${p2.post_id} has team_actions but it's empty:`, p2.team_actions);
          }
          return hasActions;
        });
        console.log("👥 Proposals with team actions:", proposalsWithActions.length);
        console.log("📝 Team actions breakdown:", proposalsWithActions.map((p2) => ({
          id: p2.post_id,
          rawActions: p2.team_actions
        })));
        const proposals = result.referendums.map((proposal) => {
          var _a, _b;
          const mappedProposal = __spreadProps(__spreadValues({}, proposal), {
            team_actions: (_a = proposal.team_actions) == null ? void 0 : _a.map((action) => {
              const mappedAction = __spreadProps(__spreadValues({}, action), {
                role_type: this.mapBackendActionToFrontend(action.role_type)
              });
              console.log(`🔄 Mapping action for proposal ${proposal.post_id}:`, {
                from: action.role_type,
                to: mappedAction.role_type
              });
              return mappedAction;
            })
          });
          if ((_b = mappedProposal.team_actions) == null ? void 0 : _b.some((a) => a.role_type === "NO WAY")) {
            console.log("🚫 Found NO WAY action in proposal:", {
              id: mappedProposal.post_id,
              actions: mappedProposal.team_actions
            });
          }
          return mappedProposal;
        });
        return proposals;
      } catch (error) {
        console.error("❌ Failed to fetch all proposals:", error);
        return [];
      }
    }
    mapBackendActionToFrontend(action) {
      console.log("🔄 Mapping action:", action);
      const mapped = (() => {
        switch (action.toLowerCase()) {
          case "no_way":
          case "noway":
          case "no way":
            return "NO WAY";
          case "to_be_discussed":
          case "tobediscussed":
          case "to be discussed":
            return "To be discussed";
          case "agree":
            return "Agree";
          case "recuse":
            return "Recuse";
          default:
            console.warn("⚠️ Unknown team action type:", action);
            return "To be discussed";
        }
      })();
      console.log(`🔄 Mapped ${action} -> ${mapped}`);
      return mapped;
    }
    async getRecentActivity() {
      try {
        const result = await this.request("/referendums?sort=updated_at&limit=50");
        return result.referendums || [];
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
        return [];
      }
    }
    // Team workflow data method
    async getTeamWorkflowData() {
      try {
        try {
          const result = await this.request("/dao/workflow");
          if (result.success && result.data) {
            console.log("✅ Got team workflow data from backend endpoint:", result.data);
            return result.data;
          }
        } catch (endpointError) {
          console.warn("Team workflow endpoint failed:", endpointError);
        }
        let allProposals = [];
        try {
          const allProposalsResult = await this.request("/proposals");
          if (allProposalsResult.success && allProposalsResult.referendums) {
            allProposals = allProposalsResult.referendums;
            console.log("✅ Got all proposals from /proposals:", allProposals.length);
          }
        } catch (error) {
          console.warn("Could not get all proposals:", error);
          allProposals = [];
        }
        const uniqueProposals = allProposals.filter(
          (proposal, index, self2) => index === self2.findIndex((p2) => p2.post_id === proposal.post_id && p2.chain === proposal.chain)
        );
        console.log("🔍 Team Workflow Debug - Total unique proposals:", uniqueProposals.length);
        console.log("🔍 Sample proposal data:", uniqueProposals.slice(0, 3).map((p2) => {
          var _a;
          return {
            id: p2.post_id,
            status: p2.internal_status,
            agreement_count: p2.agreement_count,
            required_agreements: p2.required_agreements,
            team_actions: (_a = p2.team_actions) == null ? void 0 : _a.map((a) => ({ role_type: a.role_type, member: a.team_member_name }))
          };
        }));
        console.log("🔍 ALL proposal IDs found:", uniqueProposals.map((p2) => `${p2.post_id}-${p2.chain}`));
        console.log("🔍 ALL proposal statuses:", uniqueProposals.map((p2) => `${p2.post_id}: ${p2.internal_status}`));
        const needsAgreement = uniqueProposals.filter((p2) => {
          var _a;
          const hasVeto = (_a = p2.team_actions) == null ? void 0 : _a.some((action) => action.role_type === "no_way");
          const isInConsiderationPhase = ["Considering", "Ready for approval", "Waiting for agreement"].includes(p2.internal_status);
          return !hasVeto && isInConsiderationPhase;
        });
        const readyToVote = uniqueProposals.filter((p2) => {
          var _a;
          const hasVeto = (_a = p2.team_actions) == null ? void 0 : _a.some((action) => action.role_type === "no_way");
          const isReadyStatus = p2.internal_status === "Ready to vote";
          return !hasVeto && isReadyStatus;
        });
        const forDiscussion = uniqueProposals.filter((p2) => {
          var _a;
          const markedForDiscussion = (_a = p2.team_actions) == null ? void 0 : _a.some((action) => action.role_type === "to_be_discussed");
          const isReconsidering = p2.internal_status === "Reconsidering";
          return markedForDiscussion || isReconsidering;
        });
        const vetoedProposals = uniqueProposals.filter((p2) => {
          var _a;
          return (_a = p2.team_actions) == null ? void 0 : _a.some((action) => action.role_type === "no_way");
        });
        console.log("🔍 Categorization Results:", {
          needsAgreement: needsAgreement.length,
          readyToVote: readyToVote.length,
          forDiscussion: forDiscussion.length,
          vetoedProposals: vetoedProposals.length,
          total: uniqueProposals.length
        });
        console.log("🔍 Detailed breakdown:", {
          needsAgreement: needsAgreement.map((p2) => `${p2.post_id}: ${p2.internal_status}`),
          readyToVote: readyToVote.map((p2) => `${p2.post_id}: ${p2.internal_status}`),
          forDiscussion: forDiscussion.map((p2) => `${p2.post_id}: ${p2.internal_status}`),
          vetoedProposals: vetoedProposals.map((p2) => `${p2.post_id}: ${p2.internal_status}`)
        });
        return {
          needsAgreement,
          readyToVote,
          forDiscussion,
          vetoedProposals
        };
      } catch (error) {
        console.error("Failed to fetch team workflow data:", error);
        return {
          needsAgreement: [],
          readyToVote: [],
          forDiscussion: [],
          vetoedProposals: []
        };
      }
    }
    // Helper method to ensure referendum exists in database
    async ensureReferendumExists(postId, chain) {
      try {
        const existing = await this.getProposal(postId, chain);
        if (existing) {
          return;
        }
        console.log(`Referendum ${postId} not found, attempting to refresh from Polkassembly...`);
        await this.refreshReferenda();
      } catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
          console.log(`Referendum ${postId} not found (404), attempting to refresh from Polkassembly...`);
          await this.refreshReferenda();
        } else {
          console.warn("Could not ensure referendum exists:", error);
          throw error;
        }
      }
    }
    // Method to trigger referendum refresh from Polkassembly
    async refreshReferenda() {
      try {
        await this.request(`/admin/refresh-referendas`, {
          method: "GET"
        });
        console.log("Referendum refresh request sent");
      } catch (refreshError) {
        console.warn("Could not refresh referenda:", refreshError);
        throw new Error("Referendum not found and could not be refreshed. Please try again in a moment.");
      }
    }
    // Health check
    async healthCheck() {
      try {
        return await this.request("/health");
      } catch (error) {
        return { status: "error", timestamp: (/* @__PURE__ */ new Date()).toISOString() };
      }
    }
    // Utility methods
    isAuthenticated() {
      return !!this.token;
    }
    logout() {
      this.token = null;
      localStorage.removeItem("opengov-auth-token");
    }
    setBaseUrl(url) {
      this.baseUrl = url;
    }
  };
  __publicField(_ApiService, "instance");
  let ApiService = _ApiService;
  const state$2 = reactive({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false
  });
  async function makeApiCall(endpoint, method, data, headers) {
    return new Promise((resolve, reject) => {
      const requestHeaders = __spreadValues({}, headers);
      if (state$2.token) {
        requestHeaders.Authorization = `Bearer ${state$2.token}`;
      }
      const messageId = Date.now().toString();
      chrome.runtime.sendMessage({
        type: "VOTING_TOOL_API_CALL",
        messageId,
        endpoint,
        method,
        data,
        headers: requestHeaders
      }, (response) => {
        var _a, _b, _c;
        if (chrome.runtime.lastError) {
          console.error("❌ Content script: Chrome runtime error:", chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (response && response.success) {
          resolve(response.data);
        } else {
          console.error("❌ Content script: API call failed, response:", response);
          const error = new Error((response == null ? void 0 : response.error) || "API call failed");
          if ((_b = (_a = response == null ? void 0 : response.debugInfo) == null ? void 0 : _a.errorResponseBody) == null ? void 0 : _b.details) {
            error.details = response.debugInfo.errorResponseBody.details;
            error.status = (_c = response == null ? void 0 : response.debugInfo) == null ? void 0 : _c.responseStatus;
          }
          reject(error);
        }
      });
    });
  }
  const authStore = {
    // State
    state: readonly(state$2),
    // Actions
    async login(address, signature, message) {
      try {
        state$2.isLoading = true;
        const authRequest = {
          address,
          signature,
          message,
          timestamp: Date.now()
        };
        const response = await makeApiCall("/auth/web3-login", "POST", authRequest);
        if (response.success && response.token && response.user) {
          state$2.token = response.token;
          state$2.user = response.user;
          state$2.isAuthenticated = true;
          localStorage.setItem("opengov-auth-token", response.token);
          localStorage.setItem("opengov-auth-user", JSON.stringify(response.user));
          ApiService.getInstance().refreshToken();
          window.dispatchEvent(new CustomEvent("authStateChanged", {
            detail: { isAuthenticated: true, user: response.user }
          }));
          return { success: true };
        } else {
          console.error("Login failed:", response.error);
          return {
            success: false,
            error: response.error || "Login failed"
          };
        }
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          error: error.message || "Login failed",
          details: error.details || null
        };
      } finally {
        state$2.isLoading = false;
      }
    },
    async logout() {
      try {
        if (state$2.token) {
          await makeApiCall("/auth/logout", "POST");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        state$2.token = null;
        state$2.user = null;
        state$2.isAuthenticated = false;
        localStorage.removeItem("opengov-auth-token");
        localStorage.removeItem("opengov-auth-user");
        ApiService.getInstance().refreshToken();
        window.dispatchEvent(new CustomEvent("authStateChanged", {
          detail: { isAuthenticated: false, user: null }
        }));
      }
    },
    async verifyToken() {
      try {
        if (!state$2.token) return false;
        const response = await makeApiCall("/auth/verify", "GET");
        if (response.success && response.valid) {
          if (response.user) {
            state$2.user = response.user;
          }
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        console.error("Token verification error:", error);
        this.logout();
        return false;
      }
    },
    // Initialize auth state from localStorage
    initializeFromStorage() {
      const token = localStorage.getItem("opengov-auth-token");
      const userStr = localStorage.getItem("opengov-auth-user");
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state$2.token = token;
          state$2.user = user;
          state$2.isAuthenticated = true;
          this.verifyToken();
        } catch (error) {
          console.error("Error parsing stored auth data:", error);
          this.logout();
        }
      }
    }
  };
  authStore.initializeFromStorage();
  const state$1 = reactive({
    teamMembers: [],
    daoConfig: null,
    loading: false,
    error: null
  });
  const teamStore = {
    // State
    state: readonly(state$1),
    // Getters
    get teamMembers() {
      return state$1.teamMembers;
    },
    get daoConfig() {
      return state$1.daoConfig;
    },
    get isLoading() {
      return state$1.loading;
    },
    get error() {
      return state$1.error;
    },
    // Actions
    async fetchTeamData() {
      state$1.loading = true;
      state$1.error = null;
      try {
        if (!authStore.state.isAuthenticated) {
          console.warn("Not authenticated, cannot fetch team data");
          return;
        }
        const apiService = ApiService.getInstance();
        const daoConfig = await apiService.getDAOConfig();
        if (daoConfig) {
          state$1.daoConfig = {
            name: daoConfig.name || "",
            required_agreements: daoConfig.required_agreements || 4,
            multisig_address: daoConfig.multisig_address
          };
          state$1.teamMembers = daoConfig.team_members || [];
        }
      } catch (err) {
        state$1.error = err instanceof Error ? err.message : "Failed to fetch team data";
        console.error("Failed to fetch team data:", err);
      } finally {
        state$1.loading = false;
      }
    },
    setTeamMembers(members) {
      state$1.teamMembers = members;
    },
    addTeamMember(member) {
      state$1.teamMembers.push(member);
    },
    removeTeamMember(address) {
      state$1.teamMembers = state$1.teamMembers.filter((m) => m.address !== address);
    },
    updateTeamMember(address, updates) {
      const index = state$1.teamMembers.findIndex((m) => m.address === address);
      if (index !== -1) {
        state$1.teamMembers[index] = __spreadValues(__spreadValues({}, state$1.teamMembers[index]), updates);
      }
    },
    async updateDAOConfig(config) {
      try {
        if (!authStore.state.isAuthenticated) {
          throw new Error("Not authenticated");
        }
        const apiService = ApiService.getInstance();
        await apiService.updateDAOConfig(config);
        state$1.daoConfig = {
          name: config.name,
          required_agreements: config.required_agreements
        };
        state$1.teamMembers = config.team_members;
        state$1.error = null;
      } catch (err) {
        state$1.error = err instanceof Error ? err.message : "Failed to update DAO config";
        console.error("Failed to update DAO config:", err);
        throw err;
      }
    },
    // Helper methods
    findTeamMemberByAddress(address) {
      return state$1.teamMembers.find((member) => member.address === address) || null;
    },
    getTeamMemberName(address) {
      if (!address) return "Unknown";
      const member = this.findTeamMemberByAddress(address);
      return (member == null ? void 0 : member.name) || `${address.slice(0, 6)}...${address.slice(-6)}`;
    },
    // Initialize team data if authenticated
    async initialize() {
      if (authStore.state.isAuthenticated && state$1.teamMembers.length === 0) {
        await this.fetchTeamData();
      }
    }
  };
  window.addEventListener("authStateChanged", (event) => {
    if (event.detail.isAuthenticated) {
      teamStore.initialize();
    } else {
      state$1.teamMembers = [];
      state$1.daoConfig = null;
      state$1.error = null;
    }
  });
  const formatAddress = (address, options) => {
    if (!address) return "";
    const {
      startChars = 6,
      endChars = 4,
      forceShorten = true
    } = options || {};
    if (!forceShorten && address.length <= 13) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };
  const _hoisted_1$q = { class: "wallet-connect" };
  const _hoisted_2$p = { class: "connect-header" };
  const _hoisted_3$p = { class: "connect-content" };
  const _hoisted_4$l = {
    key: 0,
    class: "step-content"
  };
  const _hoisted_5$k = { class: "wallet-options" };
  const _hoisted_6$h = {
    key: 0,
    class: "wallet-list"
  };
  const _hoisted_7$g = ["onClick", "disabled"];
  const _hoisted_8$e = { class: "wallet-icon" };
  const _hoisted_9$e = ["src", "alt"];
  const _hoisted_10$e = {
    class: "wallet-icon-fallback",
    style: { "display": "none" }
  };
  const _hoisted_11$a = { class: "wallet-info" };
  const _hoisted_12$8 = { class: "wallet-name" };
  const _hoisted_13$6 = {
    key: 0,
    class: "loading-spinner"
  };
  const _hoisted_14$5 = {
    key: 1,
    class: "no-wallets"
  };
  const _hoisted_15$4 = { class: "extension-status" };
  const _hoisted_16$4 = {
    key: 0,
    class: "status-checking"
  };
  const _hoisted_17$4 = {
    key: 1,
    class: "status-not-found"
  };
  const _hoisted_18$4 = {
    key: 2,
    class: "status-found"
  };
  const _hoisted_19$4 = {
    key: 1,
    class: "step-content"
  };
  const _hoisted_20$4 = { class: "account-list" };
  const _hoisted_21$4 = ["onClick"];
  const _hoisted_22$4 = { class: "account-avatar" };
  const _hoisted_23$4 = { class: "account-info" };
  const _hoisted_24$4 = { class: "account-name" };
  const _hoisted_25$4 = { class: "account-address" };
  const _hoisted_26$4 = { class: "account-check" };
  const _hoisted_27$3 = { class: "step-actions" };
  const _hoisted_28$3 = ["disabled"];
  const _hoisted_29$3 = {
    key: 2,
    class: "step-content"
  };
  const _hoisted_30$3 = { class: "sign-message" };
  const _hoisted_31$3 = { class: "message-content" };
  const _hoisted_32$3 = { class: "step-actions" };
  const _hoisted_33$3 = ["disabled"];
  const _hoisted_34$3 = {
    key: 3,
    class: "error-message"
  };
  const _hoisted_35$3 = { class: "error-text" };
  const _sfc_main$q = /* @__PURE__ */ defineComponent({
    __name: "WalletConnect",
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const emit2 = __emit;
      const step = ref("select");
      const accounts = ref([]);
      const selectedAccount = ref(null);
      const isConnecting = ref(false);
      const isSigning = ref(false);
      const error = ref("");
      const messageToSign = ref("");
      const extensionStatus = ref("checking");
      const availableWallets = computed(() => {
        var _a;
        return ((_a = window.opengovVotingToolResult) == null ? void 0 : _a.availableWallets) || [];
      });
      let checkInterval = null;
      onMounted(() => {
        checkForExtension();
        checkInterval = setInterval(checkForExtension, 1e3);
        setTimeout(() => {
          checkForExtension();
        }, 500);
        setTimeout(() => {
          checkForExtension();
        }, 2e3);
      });
      onUnmounted(() => {
        if (checkInterval) {
          clearInterval(checkInterval);
        }
      });
      const checkForExtension = () => {
        var _a;
        console.log("🔍 Checking for Polkadot Extension...");
        console.log("🔍 Current opengovVotingToolResult:", window.opengovVotingToolResult);
        if (window.opengovVotingToolResult) {
          console.log("📡 Page context result:", window.opengovVotingToolResult);
          if (window.opengovVotingToolResult.hasPolkadotExtension === true) {
            console.log("✅ Polkadot Extension found via page context!");
            extensionStatus.value = "found";
            if (checkInterval) {
              clearInterval(checkInterval);
              checkInterval = null;
            }
            return;
          }
        }
        console.log("🔍 Checking directly in extension context...");
        console.log("window.injectedWeb3:", window.injectedWeb3);
        console.log('window.injectedWeb3?.["polkadot-js"]:', (_a = window.injectedWeb3) == null ? void 0 : _a["polkadot-js"]);
        if (window.injectedWeb3 && window.injectedWeb3["polkadot-js"]) {
          console.log("✅ Polkadot Extension found directly!");
          extensionStatus.value = "found";
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        } else {
          console.log("❌ Polkadot Extension not found");
          extensionStatus.value = "not-found";
        }
      };
      const manualCheck = () => {
        console.log("🔄 Manual check triggered...");
        console.log("🔍 Current opengovVotingToolResult:", window.opengovVotingToolResult);
        window.postMessage({
          type: "CHECK_WALLET_EXTENSION"
        }, "*");
        setTimeout(() => {
          var _a;
          console.log("🔍 After manual check, opengovVotingToolResult:", window.opengovVotingToolResult);
          if ((_a = window.opengovVotingToolResult) == null ? void 0 : _a.hasPolkadotExtension) {
            console.log("✅ Manual check found extension!");
            extensionStatus.value = "found";
          }
        }, 1e3);
      };
      const refreshDetection = () => {
        extensionStatus.value = "checking";
        checkForExtension();
      };
      const connectToWallet = async (walletKey) => {
        var _a;
        try {
          isConnecting.value = true;
          error.value = "";
          console.log("🔗 Connecting to wallet:", walletKey);
          window.postMessage({
            type: "CONNECT_WALLET",
            walletKey
          }, "*");
          let attempts = 0;
          const maxAttempts = 20;
          while (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            attempts++;
            if ((_a = window.opengovVotingToolResult) == null ? void 0 : _a.connectionResult) {
              const result = window.opengovVotingToolResult.connectionResult;
              if (result.success) {
                console.log("✅ Wallet connected successfully:", result.accounts);
                accounts.value = result.accounts;
                step.value = "accounts";
                return;
              } else {
                throw new Error(result.error || "Failed to connect wallet");
              }
            }
          }
          throw new Error("Timeout waiting for wallet connection");
        } catch (err) {
          error.value = err instanceof Error ? err.message : "Failed to connect to wallet";
          console.error("Wallet connection error:", err);
        } finally {
          isConnecting.value = false;
        }
      };
      const selectAccount = (account) => {
        selectedAccount.value = account;
      };
      const proceedToSign = () => {
        if (!selectedAccount.value) return;
        messageToSign.value = `Authenticate with OpenGov Voting Tool

Address: ${selectedAccount.value.address}
Timestamp: ${Date.now()}

Click "Sign Message" to continue.`;
        step.value = "sign";
      };
      const handleSignMessage = async () => {
        var _a, _b;
        if (!selectedAccount.value) return;
        try {
          isSigning.value = true;
          error.value = "";
          console.log("✍️ Sending sign message request to page context...");
          console.log("✍️ Account:", selectedAccount.value.address);
          console.log("✍️ Message:", messageToSign.value);
          window.postMessage({
            type: "SIGN_MESSAGE",
            address: selectedAccount.value.address,
            message: messageToSign.value
          }, "*");
          let attempts = 0;
          const maxAttempts = 160;
          console.log("⏳ Waiting for signature result...");
          while (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            attempts++;
            console.log(`🔍 Attempt ${attempts}/${maxAttempts}: Checking for signature result...`);
            console.log("🔍 Current opengovVotingToolResult:", window.opengovVotingToolResult);
            console.log("🔍 signatureResult:", (_a = window.opengovVotingToolResult) == null ? void 0 : _a.signatureResult);
            if ((_b = window.opengovVotingToolResult) == null ? void 0 : _b.signatureResult) {
              const result = window.opengovVotingToolResult.signatureResult;
              console.log("🎯 Found signature result:", result);
              if (result.success && result.signature) {
                console.log("✅ Received signature from page context:", result.signature);
                console.log("🚀 Starting authentication with authStore.login...");
                const loginResult = await authStore.login(
                  selectedAccount.value.address,
                  result.signature,
                  messageToSign.value
                );
                console.log("🔐 Authentication result:", loginResult);
                if (loginResult.success) {
                  console.log("🎉 Authentication successful!");
                  emit2("close");
                } else {
                  console.log("❌ Authentication failed:", loginResult.error);
                  if (loginResult.details && loginResult.details.reason) {
                    error.value = formatMultisigError(loginResult.details);
                  } else {
                    error.value = loginResult.error || "Authentication failed. Please try again.";
                  }
                }
                return;
              } else {
                console.log("❌ Signature result indicates failure:", result);
                throw new Error(result.error || "Failed to sign message");
              }
            }
          }
          console.log("⏰ Timeout waiting for signature result");
          throw new Error("Timeout waiting for signature from Polkadot Extension");
        } catch (err) {
          error.value = err instanceof Error ? err.message : "Failed to sign message";
          console.error("Signature error:", err);
        } finally {
          isSigning.value = false;
        }
      };
      const getAccountInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      };
      const getWalletIcon = (walletKey) => {
        const getIconPath = (iconName) => {
          if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
            return chrome.runtime.getURL(`icons/${iconName}`);
          }
          return `/icons/${iconName}`;
        };
        switch (walletKey) {
          case "polkadot-js":
            return getIconPath("wallet-polkadot-js.svg");
          case "talisman":
            return getIconPath("wallet-talisman.svg");
          case "subwallet":
          case "subwallet-js":
          case "SubWallet":
            return getIconPath("wallet-subwallet.svg");
          case "nova-wallet":
            return getIconPath("wallet-nova.svg");
          default:
            return getIconPath("wallet-default.svg");
        }
      };
      const getWalletEmoji = (walletKey) => {
        return "💼";
      };
      const handleIconError = (event) => {
        console.log("Wallet icon failed to load, falling back to emoji");
      };
      const clearError = () => {
        error.value = "";
        step.value = "select";
      };
      const formatMultisigError = (details) => {
        if (!details) return "Access denied: Not authorized as multisig member";
        const address = details.address || "your wallet address";
        const suggestion = details.suggestion || "Please contact an administrator to add your address to the multisig";
        let configuredMultisigs = "";
        if (details.configured_multisigs) {
          const multisigs = [];
          if (details.configured_multisigs.polkadot && details.configured_multisigs.polkadot !== "Not configured") {
            multisigs.push(`Polkadot: ${details.configured_multisigs.polkadot}`);
          }
          if (details.configured_multisigs.kusama && details.configured_multisigs.kusama !== "Not configured") {
            multisigs.push(`Kusama: ${details.configured_multisigs.kusama}`);
          }
          if (multisigs.length > 0) {
            configuredMultisigs = `

Configured multisigs:
${multisigs.join("\n")}`;
          }
        }
        return `🚫 Access Denied: Multisig Member Required

${details.reason || "Your wallet address is not registered as a multisig member."}

Your address: ${address}${configuredMultisigs}

💡 ${suggestion}`;
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$q, [
          createBaseVNode("div", _hoisted_2$p, [
            _cache[3] || (_cache[3] = createBaseVNode("h3", null, "Connect Wallet", -1)),
            createBaseVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close")),
              class: "close-btn"
            }, "✕")
          ]),
          createBaseVNode("div", _hoisted_3$p, [
            step.value === "select" ? (openBlock(), createElementBlock("div", _hoisted_4$l, [
              _cache[8] || (_cache[8] = createBaseVNode("div", { class: "step-description" }, " Choose your Polkadot wallet to connect: ", -1)),
              createBaseVNode("div", _hoisted_5$k, [
                availableWallets.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_6$h, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(availableWallets.value, (wallet) => {
                    return openBlock(), createElementBlock("div", {
                      key: wallet.key,
                      onClick: ($event) => connectToWallet(wallet.key),
                      class: "wallet-option",
                      disabled: isConnecting.value
                    }, [
                      createBaseVNode("div", _hoisted_8$e, [
                        createBaseVNode("img", {
                          src: getWalletIcon(wallet.key),
                          alt: wallet.name,
                          onError: handleIconError,
                          onerror: `this.style.display='none'; this.nextElementSibling.style.display='block'`
                        }, null, 40, _hoisted_9$e),
                        createBaseVNode("span", _hoisted_10$e, toDisplayString(getWalletEmoji(wallet.key)), 1)
                      ]),
                      createBaseVNode("div", _hoisted_11$a, [
                        createBaseVNode("div", _hoisted_12$8, toDisplayString(wallet.name), 1),
                        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "wallet-description" }, "Click to connect", -1))
                      ]),
                      isConnecting.value ? (openBlock(), createElementBlock("div", _hoisted_13$6)) : createCommentVNode("", true)
                    ], 8, _hoisted_7$g);
                  }), 128))
                ])) : (openBlock(), createElementBlock("div", _hoisted_14$5, [..._cache[5] || (_cache[5] = [
                  createBaseVNode("div", { class: "no-wallets-icon" }, "⚠️", -1),
                  createBaseVNode("div", { class: "no-wallets-text" }, "No wallet extensions found", -1)
                ])]))
              ]),
              createBaseVNode("div", _hoisted_15$4, [
                extensionStatus.value === "checking" ? (openBlock(), createElementBlock("div", _hoisted_16$4, " 🔍 Checking for Polkadot Extension... ")) : extensionStatus.value === "not-found" ? (openBlock(), createElementBlock("div", _hoisted_17$4, [
                  _cache[6] || (_cache[6] = createTextVNode(" ⚠️ Polkadot Extension not found ", -1)),
                  _cache[7] || (_cache[7] = createBaseVNode("div", { class: "status-help" }, [
                    createTextVNode(" Please install the "),
                    createBaseVNode("a", {
                      href: "https://polkadot.js.org/extension/",
                      target: "_blank",
                      rel: "noopener"
                    }, "Polkadot Extension"),
                    createTextVNode(" first ")
                  ], -1)),
                  createBaseVNode("div", { class: "status-actions" }, [
                    createBaseVNode("button", {
                      onClick: refreshDetection,
                      class: "btn-secondary"
                    }, " 🔄 Refresh Detection "),
                    createBaseVNode("button", {
                      onClick: manualCheck,
                      class: "btn-secondary"
                    }, " 🔍 Manual Check ")
                  ])
                ])) : extensionStatus.value === "found" ? (openBlock(), createElementBlock("div", _hoisted_18$4, " ✅ Polkadot Extension detected ")) : createCommentVNode("", true)
              ])
            ])) : createCommentVNode("", true),
            step.value === "accounts" ? (openBlock(), createElementBlock("div", _hoisted_19$4, [
              _cache[9] || (_cache[9] = createBaseVNode("div", { class: "step-description" }, " Select an account to connect: ", -1)),
              createBaseVNode("div", _hoisted_20$4, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(accounts.value, (account) => {
                  var _a, _b;
                  return openBlock(), createElementBlock("div", {
                    key: account.address,
                    onClick: ($event) => selectAccount(account),
                    class: normalizeClass(["account-item", { selected: ((_a = selectedAccount.value) == null ? void 0 : _a.address) === account.address }])
                  }, [
                    createBaseVNode("div", _hoisted_22$4, toDisplayString(getAccountInitials(account.name || account.address)), 1),
                    createBaseVNode("div", _hoisted_23$4, [
                      createBaseVNode("div", _hoisted_24$4, toDisplayString(account.name || "Unnamed Account"), 1),
                      createBaseVNode("div", _hoisted_25$4, toDisplayString(unref(formatAddress)(account.address)), 1)
                    ]),
                    createBaseVNode("div", _hoisted_26$4, toDisplayString(((_b = selectedAccount.value) == null ? void 0 : _b.address) === account.address ? "✓" : ""), 1)
                  ], 10, _hoisted_21$4);
                }), 128))
              ]),
              createBaseVNode("div", _hoisted_27$3, [
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => step.value = "select"),
                  class: "btn-secondary"
                }, "Back"),
                createBaseVNode("button", {
                  onClick: proceedToSign,
                  class: "btn-primary",
                  disabled: !selectedAccount.value
                }, " Continue ", 8, _hoisted_28$3)
              ])
            ])) : createCommentVNode("", true),
            step.value === "sign" ? (openBlock(), createElementBlock("div", _hoisted_29$3, [
              _cache[11] || (_cache[11] = createBaseVNode("div", { class: "step-description" }, " Sign the message to authenticate: ", -1)),
              createBaseVNode("div", _hoisted_30$3, [
                _cache[10] || (_cache[10] = createBaseVNode("div", { class: "message-label" }, "Message to sign:", -1)),
                createBaseVNode("div", _hoisted_31$3, toDisplayString(messageToSign.value), 1)
              ]),
              createBaseVNode("div", _hoisted_32$3, [
                createBaseVNode("button", {
                  onClick: _cache[2] || (_cache[2] = ($event) => step.value = "accounts"),
                  class: "btn-secondary"
                }, "Back"),
                createBaseVNode("button", {
                  onClick: handleSignMessage,
                  class: "btn-primary",
                  disabled: isSigning.value
                }, toDisplayString(isSigning.value ? "Signing..." : "Sign Message"), 9, _hoisted_33$3)
              ])
            ])) : createCommentVNode("", true),
            error.value ? (openBlock(), createElementBlock("div", _hoisted_34$3, [
              _cache[12] || (_cache[12] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)),
              createBaseVNode("div", _hoisted_35$3, toDisplayString(error.value), 1),
              createBaseVNode("div", { class: "error-actions" }, [
                createBaseVNode("button", {
                  onClick: clearError,
                  class: "btn-secondary"
                }, "Try Again")
              ])
            ])) : createCommentVNode("", true)
          ])
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const WalletConnect = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-4f7ca26e"]]);
  const _hoisted_1$p = { class: "modal-header" };
  const _hoisted_2$o = { class: "modal-content" };
  const _hoisted_3$o = { class: "config-sections" };
  const _hoisted_4$k = { class: "config-section" };
  const _hoisted_5$j = { class: "form-group" };
  const _hoisted_6$g = { class: "number-input-wrapper" };
  const _hoisted_7$f = { class: "agreement-preview" };
  const _hoisted_8$d = { class: "preview-bar" };
  const _hoisted_9$d = { class: "progress-text" };
  const _hoisted_10$d = { class: "modal-actions" };
  const _hoisted_11$9 = ["disabled"];
  const _sfc_main$p = /* @__PURE__ */ defineComponent({
    __name: "DAOConfigModal",
    props: {
      show: { type: Boolean }
    },
    emits: ["close", "saved"],
    setup(__props, { emit: __emit }) {
      const emit2 = __emit;
      const requiredAgreements = ref(4);
      const handleSave = () => {
        console.log("Saving DAO config:", { required_agreements: requiredAgreements.value });
        emit2("saved");
        emit2("close");
      };
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
      };
      onMounted(() => {
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "config-modal",
            onClick: _cache[3] || (_cache[3] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$p, [
              _cache[5] || (_cache[5] = createBaseVNode("h3", null, "DAO Configuration", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$o, [
              createBaseVNode("div", _hoisted_3$o, [
                createBaseVNode("div", _hoisted_4$k, [
                  _cache[10] || (_cache[10] = createBaseVNode("h4", null, "Agreement Requirements", -1)),
                  createBaseVNode("div", _hoisted_5$j, [
                    _cache[7] || (_cache[7] = createBaseVNode("label", { for: "required-agreements" }, "Required Agreements", -1)),
                    createBaseVNode("div", _hoisted_6$g, [
                      withDirectives(createBaseVNode("input", {
                        id: "required-agreements",
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => requiredAgreements.value = $event),
                        type: "number",
                        min: "1",
                        max: "20",
                        class: "form-input number-input"
                      }, null, 512), [
                        [
                          vModelText,
                          requiredAgreements.value,
                          void 0,
                          { number: true }
                        ]
                      ]),
                      _cache[6] || (_cache[6] = createBaseVNode("div", { class: "input-help" }, ' Number of team members who must agree before a proposal can move to "Ready to vote" ', -1))
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_7$f, [
                    _cache[9] || (_cache[9] = createBaseVNode("div", { class: "preview-label" }, "Preview:", -1)),
                    createBaseVNode("div", _hoisted_8$d, [
                      _cache[8] || (_cache[8] = createBaseVNode("div", { class: "progress-bar" }, [
                        createBaseVNode("div", {
                          class: "progress-fill",
                          style: { width: "60%" }
                        })
                      ], -1)),
                      createBaseVNode("div", _hoisted_9$d, toDisplayString(Math.ceil(requiredAgreements.value * 0.6)) + " / " + toDisplayString(requiredAgreements.value) + " agreements ", 1)
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_10$d, [
                createBaseVNode("button", {
                  class: "btn btn-secondary",
                  onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("close"))
                }, "Cancel"),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: handleSave,
                  disabled: requiredAgreements.value < 1
                }, " Save Configuration ", 8, _hoisted_11$9)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const DAOConfigModal = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-973fd79d"]]);
  const state = reactive({
    proposals: [],
    currentProposal: null,
    filters: {},
    loading: false,
    error: null
  });
  const filteredProposals = computed(() => {
    let filtered = state.proposals;
    if (state.filters.status) {
      filtered = filtered.filter((p2) => p2.internal_status === state.filters.status);
    }
    if (state.filters.chain) {
      filtered = filtered.filter((p2) => p2.chain === state.filters.chain);
    }
    if (state.filters.assignedTo) {
      filtered = filtered.filter((p2) => p2.assigned_to === state.filters.assignedTo);
    }
    if (state.filters.suggestedVote) {
      filtered = filtered.filter((p2) => p2.suggested_vote === state.filters.suggestedVote);
    }
    return filtered;
  });
  const proposalsByStatus = computed(() => {
    return state.proposals.reduce((acc, proposal) => {
      const status = proposal.internal_status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(proposal);
      return acc;
    }, {});
  });
  const myAssignments = computed(() => {
    var _a;
    const currentUser = (_a = authStore.state.user) == null ? void 0 : _a.address;
    if (!currentUser) return [];
    return state.proposals.filter((p2) => p2.assigned_to === currentUser);
  });
  const actionsNeeded = computed(() => {
    var _a;
    const currentUser = (_a = authStore.state.user) == null ? void 0 : _a.address;
    if (!currentUser) return [];
    return state.proposals.filter((p2) => {
      var _a2;
      const hasNoTeamAction = !((_a2 = p2.team_actions) == null ? void 0 : _a2.some((action) => action.wallet_address === currentUser));
      const isAssignedToMe = p2.assigned_to === currentUser;
      const needsEvaluation = isAssignedToMe && !p2.suggested_vote;
      const inActionableStatus = ["Considering", "Ready for approval", "Waiting for agreement"].includes(p2.internal_status);
      return hasNoTeamAction && inActionableStatus || needsEvaluation;
    });
  });
  const myEvaluations = computed(() => {
    var _a;
    const currentUser = (_a = authStore.state.user) == null ? void 0 : _a.address;
    if (!currentUser) return [];
    return state.proposals.filter((p2) => p2.assigned_to === currentUser && p2.suggested_vote);
  });
  const proposalStore = {
    // State (readonly to prevent direct mutation)
    get state() {
      return {
        proposals: state.proposals,
        currentProposal: state.currentProposal,
        filters: state.filters,
        loading: state.loading,
        error: state.error
      };
    },
    // Getters
    get filteredProposals() {
      return filteredProposals.value;
    },
    get proposalsByStatus() {
      return proposalsByStatus.value;
    },
    get myAssignments() {
      return myAssignments.value;
    },
    get actionsNeeded() {
      return actionsNeeded.value;
    },
    get myEvaluations() {
      return myEvaluations.value;
    },
    // Actions
    async fetchProposals() {
      state.loading = true;
      state.error = null;
      console.log("🔄 ProposalStore: Starting fetchProposals...");
      try {
        if (!authStore.state.isAuthenticated) {
          console.warn("⚠️ ProposalStore: Not authenticated, cannot fetch proposals");
          return;
        }
        console.log("📡 ProposalStore: Calling ApiService.getAllProposals()...");
        const apiService = ApiService.getInstance();
        const allProposals = await apiService.getAllProposals();
        console.log("📦 ProposalStore: Received proposals from API:", {
          count: allProposals.length,
          proposalIds: allProposals.map((p2) => p2.post_id).slice(0, 10),
          // First 10 IDs
          sampleProposal: allProposals[0] ? {
            id: allProposals[0].post_id,
            title: allProposals[0].title,
            status: allProposals[0].internal_status
          } : null
        });
        state.proposals = allProposals;
        state.error = null;
        console.log("✅ ProposalStore: State updated with", state.proposals.length, "proposals");
      } catch (err) {
        state.error = err instanceof Error ? err.message : "Failed to fetch proposals";
        console.error("❌ ProposalStore: Failed to fetch proposals:", err);
      } finally {
        state.loading = false;
      }
    },
    setProposals(proposals) {
      state.proposals = proposals;
    },
    async updateProposal(proposalId, chain, updates) {
      var _a, _b;
      try {
        const apiService = ApiService.getInstance();
        const freshData = await apiService.getProposal(proposalId, chain);
        if (!freshData) {
          throw new Error("Failed to fetch updated proposal data");
        }
        const index = state.proposals.findIndex(
          (p2) => p2.post_id === proposalId && p2.chain === chain
        );
        if (index !== -1) {
          const newProposals = [...state.proposals];
          newProposals[index] = __spreadProps(__spreadValues({}, freshData), {
            suggested_vote: (updates == null ? void 0 : updates.suggested_vote) === void 0 ? void 0 : freshData.suggested_vote,
            assigned_to: (updates == null ? void 0 : updates.assigned_to) === null ? void 0 : freshData.assigned_to,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          });
          state.proposals = newProposals;
          if (((_a = state.currentProposal) == null ? void 0 : _a.post_id) === proposalId && ((_b = state.currentProposal) == null ? void 0 : _b.chain) === chain) {
            state.currentProposal = newProposals[index];
          }
          console.log("Updated proposal in store:", {
            id: proposalId,
            chain,
            status: newProposals[index].internal_status,
            suggestedVote: newProposals[index].suggested_vote,
            assignedTo: newProposals[index].assigned_to
          });
        } else {
          await this.fetchProposals();
        }
      } catch (error) {
        console.error("Failed to update proposal:", error);
        throw error;
      }
    },
    setFilters(newFilters) {
      Object.assign(state.filters, newFilters);
    },
    clearFilters() {
      Object.keys(state.filters).forEach((key) => {
        delete state.filters[key];
      });
    },
    setCurrentProposal(proposal) {
      state.currentProposal = proposal;
    },
    // Initialize proposals if authenticated
    async initialize() {
      if (authStore.state.isAuthenticated && state.proposals.length === 0) {
        await this.fetchProposals();
      }
    }
  };
  window.addEventListener("authStateChanged", (event) => {
    if (event.detail.isAuthenticated) {
      proposalStore.initialize();
    } else {
      state.proposals = [];
      state.currentProposal = null;
      state.error = null;
    }
  });
  const _hoisted_1$o = { class: "status-badge-container" };
  const _hoisted_2$n = ["title"];
  const _hoisted_3$n = { class: "status-text" };
  const _hoisted_4$j = {
    key: 0,
    class: "edit-icon"
  };
  const _hoisted_5$i = { class: "modal-content" };
  const _hoisted_6$f = { class: "status-options" };
  const _hoisted_7$e = { class: "status-grid" };
  const _hoisted_8$c = ["onClick"];
  const _hoisted_9$c = { class: "option-icon" };
  const _hoisted_10$c = { class: "option-text" };
  const _hoisted_11$8 = { class: "reason-section" };
  const _hoisted_12$7 = { class: "modal-actions" };
  const _hoisted_13$5 = ["disabled"];
  const _sfc_main$o = /* @__PURE__ */ defineComponent({
    __name: "StatusBadge",
    props: {
      status: {},
      proposalId: {},
      editable: { type: Boolean }
    },
    setup(__props) {
      const props = __props;
      const showModal = ref(false);
      const selectedStatus = ref(props.status);
      const changeReason = ref("");
      const statusConfig = {
        "Not started": { color: "#6c757d", icon: "•" },
        "Considering": { color: "#ffc107", icon: "?" },
        "Ready for approval": { color: "#17a2b8", icon: "✓" },
        "Waiting for agreement": { color: "#fd7e14", icon: "..." },
        "Ready to vote": { color: "#28a745", icon: ">" },
        "Reconsidering": { color: "#dc3545", icon: "↻" },
        "Voted 👍 Aye 👍": { color: "#198754", icon: "+" },
        "Voted 👎 Nay 👎": { color: "#dc3545", icon: "-" },
        "Voted ✌️ Abstain ✌️": { color: "#6f42c1", icon: "=" },
        "Not Voted": { color: "#e9ecef", icon: "x" }
      };
      const statusOptions = Object.keys(statusConfig).map((status) => ({
        value: status,
        icon: statusConfig[status].icon,
        color: statusConfig[status].color
      }));
      const statusClass = computed(() => {
        statusConfig[props.status];
        return {
          "status-clickable": props.editable,
          [`status-${props.status.toLowerCase().replace(/[^a-z0-9]/g, "-")}`]: true
        };
      });
      computed(() => {
        var _a;
        return ((_a = statusConfig[props.status]) == null ? void 0 : _a.icon) || "⚪";
      });
      const handleClick = () => {
        if (props.editable) {
          showModal.value = true;
          selectedStatus.value = props.status;
          changeReason.value = "";
        }
      };
      const closeModal = () => {
        showModal.value = false;
        selectedStatus.value = props.status;
        changeReason.value = "";
      };
      const saveStatusChange = async () => {
        if (!selectedStatus.value || selectedStatus.value === props.status) return;
        try {
          const changeData = {
            proposalId: props.proposalId,
            oldStatus: props.status,
            newStatus: selectedStatus.value,
            reason: changeReason.value
          };
          closeModal();
          window.dispatchEvent(new CustomEvent("statusChanged", { detail: changeData }));
        } catch (error) {
          console.error("Failed to update status:", error);
        }
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$o, [
          createBaseVNode("div", {
            class: normalizeClass(["status-badge", statusClass.value]),
            onClick: handleClick,
            title: _ctx.editable ? "Click to change status" : _ctx.status
          }, [
            createBaseVNode("span", _hoisted_3$n, toDisplayString(_ctx.status), 1),
            _ctx.editable ? (openBlock(), createElementBlock("span", _hoisted_4$j, "edit")) : createCommentVNode("", true)
          ], 10, _hoisted_2$n),
          showModal.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "modal-overlay",
            onClick: closeModal
          }, [
            createBaseVNode("div", {
              class: "status-modal",
              onClick: _cache[1] || (_cache[1] = withModifiers(() => {
              }, ["stop"]))
            }, [
              createBaseVNode("div", { class: "modal-header" }, [
                _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Change Status", -1)),
                createBaseVNode("button", {
                  class: "close-btn",
                  onClick: closeModal
                }, "×")
              ]),
              createBaseVNode("div", _hoisted_5$i, [
                createBaseVNode("p", null, [
                  _cache[3] || (_cache[3] = createBaseVNode("strong", null, "Proposal:", -1)),
                  createTextVNode(" #" + toDisplayString(_ctx.proposalId), 1)
                ]),
                createBaseVNode("p", null, [
                  _cache[4] || (_cache[4] = createBaseVNode("strong", null, "Current Status:", -1)),
                  createTextVNode(" " + toDisplayString(_ctx.status), 1)
                ]),
                createBaseVNode("div", _hoisted_6$f, [
                  _cache[5] || (_cache[5] = createBaseVNode("label", null, "New Status:", -1)),
                  createBaseVNode("div", _hoisted_7$e, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(statusOptions), (statusOption) => {
                      return openBlock(), createElementBlock("button", {
                        key: statusOption.value,
                        class: normalizeClass(["status-option", { selected: selectedStatus.value === statusOption.value }]),
                        onClick: ($event) => selectedStatus.value = statusOption.value
                      }, [
                        createBaseVNode("span", _hoisted_9$c, toDisplayString(statusOption.icon), 1),
                        createBaseVNode("span", _hoisted_10$c, toDisplayString(statusOption.value), 1)
                      ], 10, _hoisted_8$c);
                    }), 128))
                  ])
                ]),
                createBaseVNode("div", _hoisted_11$8, [
                  _cache[6] || (_cache[6] = createBaseVNode("label", { for: "reason" }, "Reason for change (optional):", -1)),
                  withDirectives(createBaseVNode("textarea", {
                    id: "reason",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => changeReason.value = $event),
                    placeholder: "Explain why you're changing the status...",
                    rows: "3"
                  }, null, 512), [
                    [vModelText, changeReason.value]
                  ])
                ]),
                createBaseVNode("div", _hoisted_12$7, [
                  createBaseVNode("button", {
                    class: "btn btn-secondary",
                    onClick: closeModal
                  }, "Cancel"),
                  createBaseVNode("button", {
                    class: "btn btn-primary",
                    onClick: saveStatusChange,
                    disabled: !selectedStatus.value || selectedStatus.value === _ctx.status
                  }, " Update Status ", 8, _hoisted_13$5)
                ])
              ])
            ])
          ])) : createCommentVNode("", true)
        ]);
      };
    }
  });
  const StatusBadge = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-875347a1"]]);
  const _hoisted_1$n = { class: "modal-header" };
  const _hoisted_2$m = { class: "browser-content" };
  const _hoisted_3$m = { class: "filter-panel" };
  const _hoisted_4$i = { class: "filter-section" };
  const _hoisted_5$h = { class: "filter-group" };
  const _hoisted_6$e = { class: "filter-group" };
  const _hoisted_7$d = ["value"];
  const _hoisted_8$b = { class: "filter-group" };
  const _hoisted_9$b = ["value"];
  const _hoisted_10$b = { class: "filter-group" };
  const _hoisted_11$7 = { class: "filter-group" };
  const _hoisted_12$6 = { class: "content-area" };
  const _hoisted_13$4 = { class: "view-controls" };
  const _hoisted_14$4 = { class: "view-modes" };
  const _hoisted_15$3 = { class: "sort-controls" };
  const _hoisted_16$3 = { class: "results-info" };
  const _hoisted_17$3 = {
    key: 0,
    class: "loading-state"
  };
  const _hoisted_18$3 = {
    key: 1,
    class: "empty-state"
  };
  const _hoisted_19$3 = { key: 2 };
  const _hoisted_20$3 = {
    key: 0,
    class: "proposals-list"
  };
  const _hoisted_21$3 = ["onClick"];
  const _hoisted_22$3 = { class: "proposal-id" };
  const _hoisted_23$3 = { class: "proposal-title" };
  const _hoisted_24$3 = { class: "proposal-status" };
  const _hoisted_25$3 = { class: "proposal-assignment" };
  const _hoisted_26$3 = ["onClick"];
  const _hoisted_27$2 = { class: "proposal-updated" };
  const _hoisted_28$2 = {
    key: 1,
    class: "proposals-cards"
  };
  const _hoisted_29$2 = ["onClick"];
  const _hoisted_30$2 = { class: "card-header" };
  const _hoisted_31$2 = { class: "proposal-id" };
  const _hoisted_32$2 = { class: "card-title" };
  const _hoisted_33$2 = { class: "card-meta" };
  const _hoisted_34$2 = { class: "meta-item" };
  const _hoisted_35$2 = { class: "meta-item" };
  const _hoisted_36$2 = {
    key: 0,
    class: "meta-item"
  };
  const _hoisted_37$2 = {
    key: 3,
    class: "pagination"
  };
  const _hoisted_38$2 = ["disabled"];
  const _hoisted_39$2 = { class: "page-info" };
  const _hoisted_40$2 = ["disabled"];
  const _sfc_main$n = /* @__PURE__ */ defineComponent({
    __name: "ProposalBrowser",
    props: {
      show: { type: Boolean }
    },
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const loading = computed(() => proposalStore.state.loading);
      const searchQuery = ref("");
      const selectedInternalStatus = ref("");
      const selectedTimelineStatus = ref("");
      const selectedAssignment = ref("");
      const selectedTeamAction = ref("");
      const viewMode = ref("list");
      const sortBy = ref("updated_at");
      const sortOrder = ref("desc");
      const currentPage = ref(1);
      const itemsPerPage = ref(20);
      const internalStatuses = [
        "Not started",
        "Considering",
        "Ready for approval",
        "Waiting for agreement",
        "Ready to vote",
        "Reconsidering",
        "Voted 👍 Aye 👍",
        "Voted 👎 Nay 👎",
        "Voted ✌️ Abstain ✌️",
        "Not Voted"
      ];
      const timelineStatuses = [
        "Lead-in",
        "DecisionDepositPlaced",
        "Submitted",
        "Deciding",
        "Confirmation",
        "ConfirmStarted",
        "Enactment",
        "Executed",
        "TimedOut",
        "Rejected"
      ];
      const filteredProposals2 = computed(() => {
        var _a, _b;
        let filtered = [...proposalStore.state.proposals];
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(
            (p2) => {
              var _a2;
              return p2.title.toLowerCase().includes(query) || ((_a2 = p2.description) == null ? void 0 : _a2.toLowerCase().includes(query)) || p2.post_id.toString().includes(query);
            }
          );
        }
        if (selectedInternalStatus.value) {
          filtered = filtered.filter((p2) => p2.internal_status === selectedInternalStatus.value);
        }
        if (selectedTimelineStatus.value) {
          filtered = filtered.filter((p2) => p2.referendum_timeline === selectedTimelineStatus.value);
        }
        if (selectedAssignment.value) {
          const currentUser = (_a = authStore.state.user) == null ? void 0 : _a.address;
          switch (selectedAssignment.value) {
            case "me":
              filtered = filtered.filter((p2) => p2.assigned_to === currentUser);
              break;
            case "unassigned":
              filtered = filtered.filter((p2) => !p2.assigned_to);
              break;
            case "others":
              filtered = filtered.filter((p2) => p2.assigned_to && p2.assigned_to !== currentUser);
              break;
          }
        }
        if (selectedTeamAction.value) {
          const currentUser = (_b = authStore.state.user) == null ? void 0 : _b.address;
          if (selectedTeamAction.value === "none") {
            filtered = filtered.filter(
              (p2) => {
                var _a2;
                return !((_a2 = p2.team_actions) == null ? void 0 : _a2.some((action) => action.wallet_address === currentUser));
              }
            );
          } else {
            filtered = filtered.filter(
              (p2) => {
                var _a2;
                return (_a2 = p2.team_actions) == null ? void 0 : _a2.some((action) => {
                  var _a3;
                  const actionType = (_a3 = action.role_type) == null ? void 0 : _a3.toLowerCase();
                  const selectedType = selectedTeamAction.value.toLowerCase();
                  const normalizedType = selectedType.replace(" ", "_");
                  return action.wallet_address === currentUser && (actionType === selectedType || actionType === normalizedType);
                });
              }
            );
          }
        }
        filtered.sort((a, b) => {
          const aVal = a[sortBy.value] || "";
          const bVal = b[sortBy.value] || "";
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return sortOrder.value === "asc" ? comparison : -comparison;
        });
        return filtered;
      });
      const totalPages = computed(() => Math.ceil(filteredProposals2.value.length / itemsPerPage.value));
      const paginatedProposals = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return filteredProposals2.value.slice(start, end);
      });
      const apiService = ApiService.getInstance();
      const loadProposals = async () => {
        console.log("🔄 ProposalBrowser: Loading proposals...");
        console.log("📊 Current store state:", {
          proposalCount: proposalStore.state.proposals.length,
          loading: proposalStore.state.loading,
          error: proposalStore.state.error
        });
        await proposalStore.fetchProposals();
        console.log("✅ ProposalBrowser: Proposals loaded:", {
          totalProposals: proposalStore.state.proposals.length,
          proposalIds: proposalStore.state.proposals.map((p2) => p2.post_id).slice(0, 10),
          // First 10 IDs
          error: proposalStore.state.error
        });
      };
      const clearFilters = () => {
        searchQuery.value = "";
        selectedInternalStatus.value = "";
        selectedTimelineStatus.value = "";
        selectedAssignment.value = "";
        selectedTeamAction.value = "";
        currentPage.value = 1;
      };
      const openProposal = async (proposal) => {
        try {
          const existingProposal = await apiService.getProposal(proposal.post_id, proposal.chain);
          if (!existingProposal) {
            await apiService.refreshReferenda();
          }
          const url = `https://${proposal.chain}.polkassembly.io/referenda/${proposal.post_id}`;
          window.open(url, "_blank");
        } catch (error) {
          console.error("Failed to open proposal:", error);
        }
      };
      const assignToMe = async (proposal, event) => {
        event.stopPropagation();
        try {
          const result = await apiService.assignProposal(proposal.post_id, proposal.chain, "responsible_person");
          if (result.success) {
            await loadProposals();
          } else {
            console.error("Failed to assign proposal:", result.error);
            alert(result.error || "Failed to assign proposal. Please try again.");
          }
        } catch (error) {
          console.error("Failed to assign proposal:", error);
          alert("Failed to assign proposal. Please try again.");
        }
      };
      watch([searchQuery, selectedInternalStatus, selectedTimelineStatus, selectedAssignment, selectedTeamAction], () => {
        currentPage.value = 1;
      });
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
      };
      watch(() => authStore.state.isAuthenticated, (isAuthenticated) => {
        if (isAuthenticated) {
          loadProposals();
        }
      });
      watch(() => props.show, (isShown) => {
        if (isShown && authStore.state.isAuthenticated) {
          loadProposals();
        }
      });
      onMounted(() => {
        if (authStore.state.isAuthenticated) {
          loadProposals();
        }
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "proposal-browser-modal",
            onClick: _cache[12] || (_cache[12] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$n, [
              _cache[14] || (_cache[14] = createBaseVNode("h2", null, "Browse Proposals", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$m, [
              createBaseVNode("div", _hoisted_3$m, [
                createBaseVNode("div", _hoisted_4$i, [
                  _cache[24] || (_cache[24] = createBaseVNode("h3", null, "Filters", -1)),
                  createBaseVNode("div", _hoisted_5$h, [
                    _cache[15] || (_cache[15] = createBaseVNode("label", null, "Search", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => searchQuery.value = $event),
                      type: "text",
                      placeholder: "Search proposals...",
                      class: "search-input"
                    }, null, 512), [
                      [vModelText, searchQuery.value]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_6$e, [
                    _cache[17] || (_cache[17] = createBaseVNode("label", null, "Internal Status", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => selectedInternalStatus.value = $event),
                      class: "filter-select"
                    }, [
                      _cache[16] || (_cache[16] = createBaseVNode("option", { value: "" }, "All Statuses", -1)),
                      (openBlock(), createElementBlock(Fragment, null, renderList(internalStatuses, (status) => {
                        return createBaseVNode("option", {
                          key: status,
                          value: status
                        }, toDisplayString(status), 9, _hoisted_7$d);
                      }), 64))
                    ], 512), [
                      [vModelSelect, selectedInternalStatus.value]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_8$b, [
                    _cache[19] || (_cache[19] = createBaseVNode("label", null, "Timeline Status", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => selectedTimelineStatus.value = $event),
                      class: "filter-select"
                    }, [
                      _cache[18] || (_cache[18] = createBaseVNode("option", { value: "" }, "All Timeline Statuses", -1)),
                      (openBlock(), createElementBlock(Fragment, null, renderList(timelineStatuses, (status) => {
                        return createBaseVNode("option", {
                          key: status,
                          value: status
                        }, toDisplayString(status), 9, _hoisted_9$b);
                      }), 64))
                    ], 512), [
                      [vModelSelect, selectedTimelineStatus.value]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_10$b, [
                    _cache[21] || (_cache[21] = createBaseVNode("label", null, "Assignment", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => selectedAssignment.value = $event),
                      class: "filter-select"
                    }, [..._cache[20] || (_cache[20] = [
                      createBaseVNode("option", { value: "" }, "All Assignments", -1),
                      createBaseVNode("option", { value: "me" }, "Assigned to Me", -1),
                      createBaseVNode("option", { value: "unassigned" }, "Unassigned", -1),
                      createBaseVNode("option", { value: "others" }, "Assigned to Others", -1)
                    ])], 512), [
                      [vModelSelect, selectedAssignment.value]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_11$7, [
                    _cache[23] || (_cache[23] = createBaseVNode("label", null, "My Team Action", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => selectedTeamAction.value = $event),
                      class: "filter-select"
                    }, [..._cache[22] || (_cache[22] = [
                      createStaticVNode('<option value="" data-v-db9e79d9>All Actions</option><option value="none" data-v-db9e79d9>No Action Taken</option><option value="Agree" data-v-db9e79d9>Agreed</option><option value="To be discussed" data-v-db9e79d9>To be Discussed</option><option value="NO WAY" data-v-db9e79d9>Vetoed</option><option value="Recuse" data-v-db9e79d9>Recused</option>', 6)
                    ])], 512), [
                      [vModelSelect, selectedTeamAction.value]
                    ])
                  ]),
                  createBaseVNode("button", {
                    onClick: clearFilters,
                    class: "clear-filters-btn"
                  }, " Clear All Filters ")
                ])
              ]),
              createBaseVNode("div", _hoisted_12$6, [
                createBaseVNode("div", _hoisted_13$4, [
                  createBaseVNode("div", _hoisted_14$4, [
                    createBaseVNode("button", {
                      onClick: _cache[6] || (_cache[6] = ($event) => viewMode.value = "list"),
                      class: normalizeClass([{ active: viewMode.value === "list" }, "view-btn"])
                    }, " 📋 List ", 2),
                    createBaseVNode("button", {
                      onClick: _cache[7] || (_cache[7] = ($event) => viewMode.value = "cards"),
                      class: normalizeClass([{ active: viewMode.value === "cards" }, "view-btn"])
                    }, " 🗃️ Cards ", 2)
                  ]),
                  createBaseVNode("div", _hoisted_15$3, [
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => sortBy.value = $event),
                      class: "sort-select"
                    }, [..._cache[25] || (_cache[25] = [
                      createStaticVNode('<option value="updated_at" data-v-db9e79d9>Last Updated</option><option value="created_at" data-v-db9e79d9>Created Date</option><option value="post_id" data-v-db9e79d9>Proposal ID</option><option value="title" data-v-db9e79d9>Title</option><option value="internal_status" data-v-db9e79d9>Status</option>', 5)
                    ])], 512), [
                      [vModelSelect, sortBy.value]
                    ]),
                    createBaseVNode("button", {
                      onClick: _cache[9] || (_cache[9] = ($event) => sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"),
                      class: "sort-order-btn"
                    }, toDisplayString(sortOrder.value === "asc" ? "↑" : "↓"), 1)
                  ]),
                  createBaseVNode("div", _hoisted_16$3, toDisplayString(filteredProposals2.value.length) + " of " + toDisplayString(unref(proposalStore).state.proposals.length) + " proposals ", 1)
                ]),
                createBaseVNode("div", {
                  class: normalizeClass(["proposals-container", viewMode.value])
                }, [
                  loading.value ? (openBlock(), createElementBlock("div", _hoisted_17$3, [..._cache[26] || (_cache[26] = [
                    createBaseVNode("div", { class: "spinner" }, null, -1),
                    createBaseVNode("p", null, "Loading proposals...", -1)
                  ])])) : filteredProposals2.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_18$3, [..._cache[27] || (_cache[27] = [
                    createBaseVNode("div", { class: "empty-icon" }, "📭", -1),
                    createBaseVNode("h3", null, "No proposals found", -1),
                    createBaseVNode("p", null, "Try adjusting your filters or search terms", -1)
                  ])])) : (openBlock(), createElementBlock("div", _hoisted_19$3, [
                    viewMode.value === "list" ? (openBlock(), createElementBlock("div", _hoisted_20$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(paginatedProposals.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_22$3, "#" + toDisplayString(proposal.post_id), 1),
                          createBaseVNode("div", _hoisted_23$3, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_24$3, [
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("div", _hoisted_25$3, [
                            createBaseVNode("span", null, toDisplayString(proposal.assigned_to || "Unassigned"), 1),
                            !proposal.assigned_to ? (openBlock(), createElementBlock("button", {
                              key: 0,
                              onClick: ($event) => assignToMe(proposal, $event),
                              class: "assign-btn"
                            }, " Assign to me ", 8, _hoisted_26$3)) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_27$2, toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                        ], 8, _hoisted_21$3);
                      }), 128))
                    ])) : createCommentVNode("", true),
                    viewMode.value === "cards" ? (openBlock(), createElementBlock("div", _hoisted_28$2, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(paginatedProposals.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-card",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_30$2, [
                            createBaseVNode("span", _hoisted_31$2, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_32$2, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_33$2, [
                            createBaseVNode("div", _hoisted_34$2, [
                              _cache[28] || (_cache[28] = createBaseVNode("strong", null, "Assigned:", -1)),
                              createTextVNode(" " + toDisplayString(unref(teamStore).getTeamMemberName(proposal.assigned_to) || unref(formatAddress)(proposal.assigned_to) || "Unassigned"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_35$2, [
                              _cache[29] || (_cache[29] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ]),
                            proposal.suggested_vote ? (openBlock(), createElementBlock("div", _hoisted_36$2, [
                              _cache[30] || (_cache[30] = createBaseVNode("strong", null, "Suggested:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.suggested_vote), 1)
                            ])) : createCommentVNode("", true)
                          ])
                        ], 8, _hoisted_29$2);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ])),
                  totalPages.value > 1 ? (openBlock(), createElementBlock("div", _hoisted_37$2, [
                    createBaseVNode("button", {
                      onClick: _cache[10] || (_cache[10] = ($event) => currentPage.value--),
                      disabled: currentPage.value === 1,
                      class: "page-btn"
                    }, " Previous ", 8, _hoisted_38$2),
                    createBaseVNode("span", _hoisted_39$2, " Page " + toDisplayString(currentPage.value) + " of " + toDisplayString(totalPages.value), 1),
                    createBaseVNode("button", {
                      onClick: _cache[11] || (_cache[11] = ($event) => currentPage.value++),
                      disabled: currentPage.value === totalPages.value,
                      class: "page-btn"
                    }, " Next ", 8, _hoisted_40$2)
                  ])) : createCommentVNode("", true)
                ], 2)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const ProposalBrowser = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-db9e79d9"]]);
  const _hoisted_1$m = { class: "modal-header" };
  const _hoisted_2$l = { class: "settings-content" };
  const _hoisted_3$l = { class: "settings-nav" };
  const _hoisted_4$h = { class: "nav-section" };
  const _hoisted_5$g = { class: "nav-section" };
  const _hoisted_6$d = { class: "nav-section" };
  const _hoisted_7$c = { class: "settings-main" };
  const _hoisted_8$a = {
    key: 0,
    class: "section-content"
  };
  const _hoisted_9$a = { class: "config-form" };
  const _hoisted_10$a = { class: "form-group" };
  const _hoisted_11$6 = { class: "backend-config" };
  const _hoisted_12$5 = { class: "backend-actions" };
  const _hoisted_13$3 = ["disabled"];
  const _hoisted_14$3 = ["disabled"];
  const _hoisted_15$2 = { class: "form-group" };
  const _hoisted_16$2 = { class: "readonly-field" };
  const _hoisted_17$2 = { class: "form-group" };
  const _hoisted_18$2 = { class: "team-members-list" };
  const _hoisted_19$2 = { class: "member-display-name" };
  const _hoisted_20$2 = { class: "member-address" };
  const _hoisted_21$2 = {
    key: 0,
    class: "no-members"
  };
  const _hoisted_22$2 = {
    key: 1,
    class: "section-content"
  };
  const _hoisted_23$2 = {
    key: 2,
    class: "section-content"
  };
  const _hoisted_24$2 = { class: "voting-stats" };
  const _hoisted_25$2 = { class: "stat-card" };
  const _hoisted_26$2 = { class: "stat-number" };
  const _hoisted_27$1 = { class: "stat-card" };
  const _hoisted_28$1 = { class: "stat-number" };
  const _hoisted_29$1 = { class: "stat-card" };
  const _hoisted_30$1 = { class: "stat-number" };
  const _hoisted_31$1 = { class: "stat-card" };
  const _hoisted_32$1 = { class: "stat-number" };
  const _hoisted_33$1 = { class: "voting-history-list" };
  const _hoisted_34$1 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_35$1 = { key: 1 };
  const _hoisted_36$1 = { class: "vote-header" };
  const _hoisted_37$1 = { class: "proposal-id" };
  const _hoisted_38$1 = { class: "vote-title" };
  const _hoisted_39$1 = { class: "vote-date" };
  const _hoisted_40$1 = {
    key: 3,
    class: "section-content"
  };
  const _hoisted_41$1 = { class: "activity-log" };
  const _hoisted_42$1 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_43$1 = {
    key: 1,
    class: "activity-list"
  };
  const _hoisted_44$1 = { class: "activity-icon" };
  const _hoisted_45$1 = { class: "activity-details" };
  const _hoisted_46$1 = { class: "activity-description" };
  const _hoisted_47$1 = { class: "activity-time" };
  const _hoisted_48$1 = {
    key: 4,
    class: "section-content"
  };
  const _hoisted_49$1 = { class: "sync-section" };
  const _hoisted_50$1 = { class: "sync-actions" };
  const _hoisted_51 = ["disabled"];
  const _hoisted_52 = ["disabled"];
  const _hoisted_53 = {
    key: 5,
    class: "section-content"
  };
  const _hoisted_54 = { class: "help-content" };
  const _hoisted_55 = { class: "help-links" };
  const _hoisted_56 = {
    key: 6,
    class: "section-content"
  };
  const _hoisted_57 = { class: "about-content" };
  const _hoisted_58 = { class: "about-section" };
  const _hoisted_59 = { class: "about-links" };
  const _sfc_main$m = /* @__PURE__ */ defineComponent({
    __name: "SettingsMore",
    props: {
      show: { type: Boolean }
    },
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const handleEscKey = (event) => {
        if (event.key === "Escape" && props.show) {
          emit2("close");
        }
      };
      onMounted(() => {
        window.addEventListener("keydown", handleEscKey);
        loadData();
      });
      onUnmounted(() => {
        window.removeEventListener("keydown", handleEscKey);
      });
      const activeSection = ref("dao-config");
      const extensionVersion = ref(chrome.runtime.getManifest().version);
      const refreshing = ref(false);
      const syncing = ref(false);
      const backendUrl = ref("");
      const testingConnection = ref(false);
      const savingBackend = ref(false);
      const backendStatus = ref({ message: "", type: "info" });
      const daoConfig = computed({
        get: () => {
          var _a, _b;
          return {
            name: ((_a = teamStore.daoConfig) == null ? void 0 : _a.name) || "",
            requiredAgreements: ((_b = teamStore.daoConfig) == null ? void 0 : _b.required_agreements) || 4,
            teamMembers: teamStore.teamMembers
          };
        },
        set: () => {
        }
      });
      const votingStats = ref({
        totalVotes: 0,
        ayeVotes: 0,
        nayVotes: 0,
        abstainVotes: 0
      });
      const votingHistory = ref([]);
      const activityLog = ref([]);
      const loadData = async () => {
        refreshing.value = true;
        try {
          const result = await chrome.storage.sync.get(["backendUrl"]);
          if (result.backendUrl) {
            backendUrl.value = result.backendUrl;
          }
        } catch (error) {
          console.error("Failed to load settings:", error);
        } finally {
          refreshing.value = false;
        }
      };
      const validateBackendUrl = () => {
        if (!backendUrl.value) return;
        try {
          new URL(backendUrl.value);
          backendStatus.value = { message: "", type: "info" };
        } catch (e) {
          backendStatus.value = {
            message: "Please enter a valid URL (e.g., https://api.yourdao.com)",
            type: "error"
          };
        }
      };
      const testBackendConnection = async () => {
        if (!backendUrl.value) return;
        testingConnection.value = true;
        backendStatus.value = { message: "", type: "info" };
        try {
          const url = new URL(backendUrl.value);
          const normalizedUrl = url.origin;
          try {
            const permissionResponse = await new Promise((resolve, reject) => {
              chrome.runtime.sendMessage({
                type: "CHECK_PERMISSION",
                origin: normalizedUrl
              }, (response2) => {
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError.message));
                  return;
                }
                resolve(response2);
              });
            });
            if (permissionResponse && permissionResponse.success && !permissionResponse.hasPermission) {
              backendStatus.value = {
                message: 'No permission for this URL. Please click "Save" first to grant permission.',
                type: "error"
              };
              return;
            }
          } catch (permError) {
          }
          const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Connection timeout"));
            }, 1e4);
            chrome.runtime.sendMessage({
              type: "VOTING_TOOL_API_CALL",
              messageId: Date.now().toString(),
              endpoint: "/health",
              method: "GET",
              data: void 0,
              headers: {},
              testUrl: backendUrl.value
            }, (response2) => {
              clearTimeout(timeout);
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
              }
              resolve(response2);
            });
          });
          if (response && response.success) {
            backendStatus.value = {
              message: "Connection successful! Backend is reachable.",
              type: "success"
            };
          } else {
            const errorMsg = (response == null ? void 0 : response.error) || "Unknown error";
            backendStatus.value = {
              message: `Connection failed: ${errorMsg}`,
              type: "error"
            };
          }
        } catch (error) {
          backendStatus.value = {
            message: `Connection failed: ${error instanceof Error ? error.message : "Unable to reach the backend server"}`,
            type: "error"
          };
        } finally {
          testingConnection.value = false;
        }
      };
      const saveBackendUrl = async () => {
        if (!backendUrl.value) return;
        savingBackend.value = true;
        backendStatus.value = { message: "", type: "info" };
        try {
          const url = new URL(backendUrl.value);
          const normalizedUrl = url.origin;
          try {
            const permissionResponse = await new Promise((resolve, reject) => {
              chrome.runtime.sendMessage({
                type: "REQUEST_PERMISSION",
                origin: normalizedUrl
              }, (response) => {
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError.message));
                  return;
                }
                resolve(response);
              });
            });
            if (permissionResponse && permissionResponse.success) {
              if (!permissionResponse.granted) {
                backendStatus.value = {
                  message: "Permission denied. Please allow access to this backend URL.",
                  type: "error"
                };
                return;
              }
            }
          } catch (permError) {
          }
          await chrome.storage.sync.set({ backendUrl: normalizedUrl });
          backendStatus.value = {
            message: "Backend URL saved successfully! You can now test the connection.",
            type: "success"
          };
          window.dispatchEvent(new CustomEvent("backend-url-changed", {
            detail: { url: normalizedUrl }
          }));
        } catch (error) {
          backendStatus.value = {
            message: `Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`,
            type: "error"
          };
        } finally {
          savingBackend.value = false;
        }
      };
      const normalSync = async () => {
        syncing.value = true;
        try {
          const apiService = ApiService.getInstance();
          const result = await apiService.triggerSync("normal");
          if (result.success) {
            console.log("Normal sync started:", result.message);
          } else {
            console.error("Normal sync failed:", result.error);
          }
        } catch (error) {
          console.error("Normal sync failed:", error);
        } finally {
          syncing.value = false;
        }
      };
      const deepSync = async () => {
        syncing.value = true;
        try {
          const apiService = ApiService.getInstance();
          const result = await apiService.triggerSync("deep");
          if (result.success) {
            console.log("Deep sync started:", result.message);
          } else {
            console.error("Deep sync failed:", result.error);
          }
        } catch (error) {
          console.error("Deep sync failed:", error);
        } finally {
          syncing.value = false;
        }
      };
      const openExternal = (url) => {
        window.open(url, "_blank");
      };
      const getActivityIcon = (type) => {
        switch (type) {
          case "vote":
            return "🗳️";
          case "assignment":
            return "📝";
          case "team-action":
            return "👥";
          case "sync":
            return "🔄";
          default:
            return "📋";
        }
      };
      const formatDate2 = (dateString) => {
        return new Date(dateString).toLocaleDateString();
      };
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[14] || (_cache[14] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "settings-modal",
            onClick: _cache[13] || (_cache[13] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$m, [
              _cache[15] || (_cache[15] = createBaseVNode("h2", null, "Settings & More", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$l, [
              createBaseVNode("div", _hoisted_3$l, [
                createBaseVNode("div", _hoisted_4$h, [
                  _cache[18] || (_cache[18] = createBaseVNode("h3", null, "Configuration", -1)),
                  createBaseVNode("button", {
                    onClick: _cache[1] || (_cache[1] = ($event) => activeSection.value = "dao-config"),
                    class: normalizeClass([{ active: activeSection.value === "dao-config" }, "nav-item"])
                  }, [..._cache[16] || (_cache[16] = [
                    createBaseVNode("span", { class: "nav-icon" }, "⚙️", -1),
                    createTextVNode(" DAO Configuration ", -1)
                  ])], 2),
                  createBaseVNode("button", {
                    onClick: _cache[2] || (_cache[2] = ($event) => activeSection.value = "preferences"),
                    class: normalizeClass([{ active: activeSection.value === "preferences" }, "nav-item"]),
                    disabled: ""
                  }, [..._cache[17] || (_cache[17] = [
                    createBaseVNode("span", { class: "nav-icon" }, "🎛️", -1),
                    createTextVNode(" User Preferences ", -1)
                  ])], 2)
                ]),
                createBaseVNode("div", _hoisted_5$g, [
                  _cache[22] || (_cache[22] = createBaseVNode("h3", null, "History & Data", -1)),
                  createBaseVNode("button", {
                    onClick: _cache[3] || (_cache[3] = ($event) => activeSection.value = "voting-history"),
                    class: normalizeClass([{ active: activeSection.value === "voting-history" }, "nav-item"])
                  }, [..._cache[19] || (_cache[19] = [
                    createBaseVNode("span", { class: "nav-icon" }, "🗳️", -1),
                    createTextVNode(" Voting History ", -1)
                  ])], 2),
                  createBaseVNode("button", {
                    onClick: _cache[4] || (_cache[4] = ($event) => activeSection.value = "activity-log"),
                    class: normalizeClass([{ active: activeSection.value === "activity-log" }, "nav-item"])
                  }, [..._cache[20] || (_cache[20] = [
                    createBaseVNode("span", { class: "nav-icon" }, "📊", -1),
                    createTextVNode(" Activity Log ", -1)
                  ])], 2),
                  createBaseVNode("button", {
                    onClick: _cache[5] || (_cache[5] = ($event) => activeSection.value = "data-sync"),
                    class: normalizeClass([{ active: activeSection.value === "data-sync" }, "nav-item"])
                  }, [..._cache[21] || (_cache[21] = [
                    createBaseVNode("span", { class: "nav-icon" }, "🔄", -1),
                    createTextVNode(" Data Sync ", -1)
                  ])], 2)
                ]),
                createBaseVNode("div", _hoisted_6$d, [
                  _cache[25] || (_cache[25] = createBaseVNode("h3", null, "Support", -1)),
                  createBaseVNode("button", {
                    onClick: _cache[6] || (_cache[6] = ($event) => activeSection.value = "help"),
                    class: normalizeClass([{ active: activeSection.value === "help" }, "nav-item"])
                  }, [..._cache[23] || (_cache[23] = [
                    createBaseVNode("span", { class: "nav-icon" }, "❓", -1),
                    createTextVNode(" Help & Guide ", -1)
                  ])], 2),
                  createBaseVNode("button", {
                    onClick: _cache[7] || (_cache[7] = ($event) => activeSection.value = "about"),
                    class: normalizeClass([{ active: activeSection.value === "about" }, "nav-item"])
                  }, [..._cache[24] || (_cache[24] = [
                    createBaseVNode("span", { class: "nav-icon" }, "ℹ️", -1),
                    createTextVNode(" About ", -1)
                  ])], 2)
                ])
              ]),
              createBaseVNode("div", _hoisted_7$c, [
                activeSection.value === "dao-config" ? (openBlock(), createElementBlock("div", _hoisted_8$a, [
                  _cache[37] || (_cache[37] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "DAO Configuration"),
                    createBaseVNode("p", null, "Configure your DAO settings and team parameters")
                  ], -1)),
                  createBaseVNode("div", _hoisted_9$a, [
                    createBaseVNode("div", _hoisted_10$a, [
                      _cache[26] || (_cache[26] = createBaseVNode("label", null, "Backend API Endpoint", -1)),
                      createBaseVNode("div", _hoisted_11$6, [
                        withDirectives(createBaseVNode("input", {
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => backendUrl.value = $event),
                          type: "url",
                          class: "form-input",
                          placeholder: "https://api.yourdao.com",
                          onBlur: validateBackendUrl
                        }, null, 544), [
                          [vModelText, backendUrl.value]
                        ]),
                        createBaseVNode("div", _hoisted_12$5, [
                          createBaseVNode("button", {
                            onClick: testBackendConnection,
                            class: "test-btn",
                            disabled: testingConnection.value || !backendUrl.value
                          }, toDisplayString(testingConnection.value ? "Testing..." : "Test"), 9, _hoisted_13$3),
                          createBaseVNode("button", {
                            onClick: saveBackendUrl,
                            class: "save-backend-btn",
                            disabled: savingBackend.value || !backendUrl.value
                          }, toDisplayString(savingBackend.value ? "Saving..." : "Save"), 9, _hoisted_14$3)
                        ])
                      ]),
                      backendStatus.value.message ? (openBlock(), createElementBlock("div", {
                        key: 0,
                        class: normalizeClass(["backend-status", backendStatus.value.type])
                      }, toDisplayString(backendStatus.value.message), 3)) : createCommentVNode("", true),
                      _cache[27] || (_cache[27] = createBaseVNode("small", null, `Enter the URL of your DAO's VotingTool backend server. Click "Save" first to grant permissions, then "Test" to verify connection.`, -1))
                    ]),
                    createBaseVNode("div", _hoisted_15$2, [
                      _cache[29] || (_cache[29] = createBaseVNode("label", null, "Required Agreements", -1)),
                      createBaseVNode("div", _hoisted_16$2, [
                        withDirectives(createBaseVNode("input", {
                          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => daoConfig.value.requiredAgreements = $event),
                          type: "number",
                          class: "form-input",
                          readonly: ""
                        }, null, 512), [
                          [vModelText, daoConfig.value.requiredAgreements]
                        ]),
                        _cache[28] || (_cache[28] = createBaseVNode("span", { class: "multisig-badge" }, "🔒 Controlled by Multisig", -1))
                      ]),
                      _cache[30] || (_cache[30] = createBaseVNode("small", null, "Number of team members required to agree before voting (managed by multisig)", -1))
                    ]),
                    createBaseVNode("div", _hoisted_17$2, [
                      _cache[33] || (_cache[33] = createBaseVNode("label", null, "Team Members", -1)),
                      _cache[34] || (_cache[34] = createBaseVNode("div", { class: "readonly-field-header" }, [
                        createBaseVNode("span", { class: "multisig-badge" }, "🔒 Controlled by Multisig")
                      ], -1)),
                      _cache[35] || (_cache[35] = createBaseVNode("p", { class: "form-note" }, "Team members are automatically synced from the multisig configuration.", -1)),
                      createBaseVNode("div", _hoisted_18$2, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(daoConfig.value.teamMembers, (member, index) => {
                          return openBlock(), createElementBlock("div", {
                            key: index,
                            class: "member-item readonly"
                          }, [
                            createBaseVNode("div", _hoisted_19$2, toDisplayString(member.name || "Team Member " + (index + 1)), 1),
                            createBaseVNode("div", _hoisted_20$2, toDisplayString(member.address), 1),
                            _cache[31] || (_cache[31] = createBaseVNode("span", { class: "member-info" }, "From multisig", -1))
                          ]);
                        }), 128)),
                        daoConfig.value.teamMembers.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_21$2, [..._cache[32] || (_cache[32] = [
                          createBaseVNode("div", { class: "empty-state" }, [
                            createBaseVNode("span", { class: "empty-icon" }, "👥"),
                            createBaseVNode("p", null, "No team members found"),
                            createBaseVNode("small", null, "Connect to your multisig to automatically load team members")
                          ], -1)
                        ])])) : createCommentVNode("", true)
                      ])
                    ]),
                    _cache[36] || (_cache[36] = createBaseVNode("div", { class: "form-note" }, [
                      createBaseVNode("p", null, [
                        createBaseVNode("strong", null, "💡 DAO Configuration:")
                      ]),
                      createBaseVNode("p", null, "All settings are automatically managed by the multisig configuration. Team members and required agreements are synced from the blockchain.")
                    ], -1))
                  ])
                ])) : createCommentVNode("", true),
                activeSection.value === "preferences" ? (openBlock(), createElementBlock("div", _hoisted_22$2, [..._cache[38] || (_cache[38] = [
                  createStaticVNode('<div class="section-header" data-v-88029c73><h3 data-v-88029c73>User Preferences</h3><p data-v-88029c73>Customize your extension experience (coming soon)</p></div><div class="coming-soon" data-v-88029c73><div class="coming-soon-icon" data-v-88029c73>🚧</div><h4 data-v-88029c73>Feature in Development</h4><p data-v-88029c73>User preferences will be available in a future update. This will include:</p><ul data-v-88029c73><li data-v-88029c73>Notification settings</li><li data-v-88029c73>Default view modes</li><li data-v-88029c73>Theme customization</li><li data-v-88029c73>Auto-sync preferences</li></ul></div>', 2)
                ])])) : createCommentVNode("", true),
                activeSection.value === "voting-history" ? (openBlock(), createElementBlock("div", _hoisted_23$2, [
                  _cache[44] || (_cache[44] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "Voting History"),
                    createBaseVNode("p", null, "Your voting record and participation statistics")
                  ], -1)),
                  createBaseVNode("div", _hoisted_24$2, [
                    createBaseVNode("div", _hoisted_25$2, [
                      createBaseVNode("div", _hoisted_26$2, toDisplayString(votingStats.value.totalVotes), 1),
                      _cache[39] || (_cache[39] = createBaseVNode("div", { class: "stat-label" }, "Total Votes", -1))
                    ]),
                    createBaseVNode("div", _hoisted_27$1, [
                      createBaseVNode("div", _hoisted_28$1, toDisplayString(votingStats.value.ayeVotes), 1),
                      _cache[40] || (_cache[40] = createBaseVNode("div", { class: "stat-label" }, "Aye Votes", -1))
                    ]),
                    createBaseVNode("div", _hoisted_29$1, [
                      createBaseVNode("div", _hoisted_30$1, toDisplayString(votingStats.value.nayVotes), 1),
                      _cache[41] || (_cache[41] = createBaseVNode("div", { class: "stat-label" }, "Nay Votes", -1))
                    ]),
                    createBaseVNode("div", _hoisted_31$1, [
                      createBaseVNode("div", _hoisted_32$1, toDisplayString(votingStats.value.abstainVotes), 1),
                      _cache[42] || (_cache[42] = createBaseVNode("div", { class: "stat-label" }, "Abstain Votes", -1))
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_33$1, [
                    votingHistory.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_34$1, [..._cache[43] || (_cache[43] = [
                      createBaseVNode("div", { class: "empty-icon" }, "🗳️", -1),
                      createBaseVNode("h4", null, "No voting history", -1),
                      createBaseVNode("p", null, "Your voting history will appear here", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_35$1, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(votingHistory.value, (vote) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${vote.chain}-${vote.postId}`,
                          class: "vote-item"
                        }, [
                          createBaseVNode("div", _hoisted_36$1, [
                            createBaseVNode("span", _hoisted_37$1, "#" + toDisplayString(vote.postId), 1),
                            createBaseVNode("span", {
                              class: normalizeClass(["vote-badge", vote.vote.toLowerCase()])
                            }, toDisplayString(vote.vote), 3)
                          ]),
                          createBaseVNode("div", _hoisted_38$1, toDisplayString(vote.title), 1),
                          createBaseVNode("div", _hoisted_39$1, toDisplayString(formatDate2(vote.votedAt)), 1)
                        ]);
                      }), 128))
                    ]))
                  ])
                ])) : createCommentVNode("", true),
                activeSection.value === "activity-log" ? (openBlock(), createElementBlock("div", _hoisted_40$1, [
                  _cache[46] || (_cache[46] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "Activity Log"),
                    createBaseVNode("p", null, "Recent actions and system events")
                  ], -1)),
                  createBaseVNode("div", _hoisted_41$1, [
                    activityLog.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_42$1, [..._cache[45] || (_cache[45] = [
                      createBaseVNode("div", { class: "empty-icon" }, "📊", -1),
                      createBaseVNode("h4", null, "No activity logged", -1),
                      createBaseVNode("p", null, "Your activity will be tracked here", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_43$1, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(activityLog.value, (activity) => {
                        return openBlock(), createElementBlock("div", {
                          key: activity.id,
                          class: "activity-item"
                        }, [
                          createBaseVNode("div", _hoisted_44$1, toDisplayString(getActivityIcon(activity.type)), 1),
                          createBaseVNode("div", _hoisted_45$1, [
                            createBaseVNode("div", _hoisted_46$1, toDisplayString(activity.description), 1),
                            createBaseVNode("div", _hoisted_47$1, toDisplayString(formatDate2(activity.timestamp)), 1)
                          ])
                        ]);
                      }), 128))
                    ]))
                  ])
                ])) : createCommentVNode("", true),
                activeSection.value === "data-sync" ? (openBlock(), createElementBlock("div", _hoisted_48$1, [
                  _cache[49] || (_cache[49] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "Data Synchronization"),
                    createBaseVNode("p", null, "Manage data sync with Polkassembly and backend (under review)")
                  ], -1)),
                  createBaseVNode("div", _hoisted_49$1, [
                    _cache[47] || (_cache[47] = createBaseVNode("div", { class: "sync-description" }, [
                      createBaseVNode("p", null, "Manually trigger data synchronization with Polkassembly to get the latest referendum information.")
                    ], -1)),
                    createBaseVNode("div", _hoisted_50$1, [
                      createBaseVNode("button", {
                        onClick: normalSync,
                        class: "sync-btn",
                        disabled: syncing.value
                      }, toDisplayString(syncing.value ? "🔄 Syncing..." : "🔄 Normal Sync"), 9, _hoisted_51),
                      createBaseVNode("button", {
                        onClick: deepSync,
                        class: "sync-btn deep",
                        disabled: syncing.value
                      }, toDisplayString(syncing.value ? "🔄 Syncing..." : "⚡ Deep Sync"), 9, _hoisted_52)
                    ]),
                    _cache[48] || (_cache[48] = createBaseVNode("div", { class: "sync-info" }, [
                      createBaseVNode("div", { class: "sync-type" }, [
                        createBaseVNode("strong", null, "Normal Sync:"),
                        createTextVNode(" Fetches the last 30 proposals (recommended for regular updates) ")
                      ]),
                      createBaseVNode("div", { class: "sync-type" }, [
                        createBaseVNode("strong", null, "Deep Sync:"),
                        createTextVNode(" Fetches the last 100 proposals (use when you need comprehensive data) ")
                      ])
                    ], -1))
                  ])
                ])) : createCommentVNode("", true),
                activeSection.value === "help" ? (openBlock(), createElementBlock("div", _hoisted_53, [
                  _cache[51] || (_cache[51] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "Help & Guide"),
                    createBaseVNode("p", null, "Learn how to use the DAO Voting Tool extension")
                  ], -1)),
                  createBaseVNode("div", _hoisted_54, [
                    _cache[50] || (_cache[50] = createStaticVNode('<div class="help-section" data-v-88029c73><h4 data-v-88029c73>Getting Started</h4><ul data-v-88029c73><li data-v-88029c73>Connect your wallet to authenticate</li><li data-v-88029c73>Browse and filter proposals</li><li data-v-88029c73>Assign proposals to team members</li><li data-v-88029c73>Participate in team discussions</li></ul></div><div class="help-section" data-v-88029c73><h4 data-v-88029c73>Team Workflow</h4><ul data-v-88029c73><li data-v-88029c73><strong data-v-88029c73>Agree:</strong> Support the proposal evaluation</li><li data-v-88029c73><strong data-v-88029c73>To be discussed:</strong> Mark for team discussion</li><li data-v-88029c73><strong data-v-88029c73>NO WAY (Veto):</strong> Forces Nay (needs reasoning)</li><li data-v-88029c73><strong data-v-88029c73>Recuse:</strong> Abstain due to conflict of interest</li></ul></div><div class="help-section" data-v-88029c73><h4 data-v-88029c73>Status Flow</h4><ol data-v-88029c73><li data-v-88029c73>Not started → Considering</li><li data-v-88029c73>Considering → Ready for approval</li><li data-v-88029c73>Ready for approval → Waiting for agreement</li><li data-v-88029c73>Waiting for agreement → Ready to vote</li><li data-v-88029c73>Ready to vote → Voted</li></ol></div>', 3)),
                    createBaseVNode("div", _hoisted_55, [
                      createBaseVNode("a", {
                        href: "#",
                        onClick: _cache[10] || (_cache[10] = ($event) => openExternal("https://github.com/ZelmaCorp/VotingTool")),
                        class: "help-link"
                      }, " 📚 Full Documentation "),
                      createBaseVNode("a", {
                        href: "#",
                        onClick: _cache[11] || (_cache[11] = ($event) => openExternal("https://github.com/ZelmaCorp/VotingTool/issues")),
                        class: "help-link"
                      }, " 🐛 Report Issues ")
                    ])
                  ])
                ])) : createCommentVNode("", true),
                activeSection.value === "about" ? (openBlock(), createElementBlock("div", _hoisted_56, [
                  _cache[55] || (_cache[55] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "About DAO Voting Tool"),
                    createBaseVNode("p", null, "Information about this extension")
                  ], -1)),
                  createBaseVNode("div", _hoisted_57, [
                    createBaseVNode("div", _hoisted_58, [
                      _cache[52] || (_cache[52] = createBaseVNode("h4", null, "Version", -1)),
                      createBaseVNode("p", null, toDisplayString(extensionVersion.value), 1)
                    ]),
                    _cache[53] || (_cache[53] = createBaseVNode("div", { class: "about-section" }, [
                      createBaseVNode("h4", null, "Description"),
                      createBaseVNode("p", null, "A browser extension that helps small DAOs discuss and coordinate voting on Polkassembly proposals.")
                    ], -1)),
                    _cache[54] || (_cache[54] = createBaseVNode("div", { class: "about-section" }, [
                      createBaseVNode("h4", null, "Features"),
                      createBaseVNode("ul", null, [
                        createBaseVNode("li", null, "Proposal browsing and filtering"),
                        createBaseVNode("li", null, "Team collaboration tools"),
                        createBaseVNode("li", null, "Internal status tracking"),
                        createBaseVNode("li", null, "Voting coordination"),
                        createBaseVNode("li", null, "Discussion management")
                      ])
                    ], -1)),
                    createBaseVNode("div", _hoisted_59, [
                      createBaseVNode("a", {
                        href: "#",
                        onClick: _cache[12] || (_cache[12] = ($event) => openExternal("https://github.com/ZelmaCorp/VotingTool/")),
                        class: "about-link"
                      }, " 🔗 Source Code ")
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const SettingsMore = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-88029c73"]]);
  const _hoisted_1$l = { class: "content-area" };
  const _hoisted_2$k = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_3$k = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_4$g = ["onClick"];
  const _hoisted_5$f = { class: "proposal-header" };
  const _hoisted_6$c = { class: "proposal-id" };
  const _hoisted_7$b = { class: "proposal-title" };
  const _hoisted_8$9 = { class: "proposal-meta" };
  const _hoisted_9$9 = { class: "meta-item" };
  const _hoisted_10$9 = { class: "meta-item" };
  const _sfc_main$l = /* @__PURE__ */ defineComponent({
    __name: "MyAssignmentsTab",
    props: {
      assignments: {}
    },
    emits: ["open-proposal"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$l, [
          _ctx.assignments.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_2$k, [..._cache[0] || (_cache[0] = [
            createBaseVNode("div", { class: "empty-icon" }, "📭", -1),
            createBaseVNode("h3", null, "No assignments", -1),
            createBaseVNode("p", null, "You don't have any proposals assigned to you", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_3$k, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.assignments, (proposal) => {
              return openBlock(), createElementBlock("div", {
                key: `${proposal.chain}-${proposal.post_id}`,
                class: "proposal-item",
                onClick: ($event) => _ctx.$emit("open-proposal", proposal)
              }, [
                createBaseVNode("div", _hoisted_5$f, [
                  createBaseVNode("span", _hoisted_6$c, "#" + toDisplayString(proposal.post_id), 1),
                  createVNode(StatusBadge, {
                    status: proposal.internal_status,
                    "proposal-id": proposal.post_id,
                    editable: false
                  }, null, 8, ["status", "proposal-id"])
                ]),
                createBaseVNode("h4", _hoisted_7$b, toDisplayString(proposal.title), 1),
                createBaseVNode("div", _hoisted_8$9, [
                  createBaseVNode("div", _hoisted_9$9, [
                    _cache[1] || (_cache[1] = createBaseVNode("strong", null, "Timeline:", -1)),
                    createTextVNode(" " + toDisplayString(proposal.referendum_timeline || "Unknown"), 1)
                  ]),
                  createBaseVNode("div", _hoisted_10$9, [
                    _cache[2] || (_cache[2] = createBaseVNode("strong", null, "Updated:", -1)),
                    createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                  ])
                ])
              ], 8, _hoisted_4$g);
            }), 128))
          ]))
        ]);
      };
    }
  });
  const MyAssignmentsTab = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-9210fae2"]]);
  const _hoisted_1$k = { class: "content-area" };
  const _hoisted_2$j = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_3$j = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_4$f = ["onClick"];
  const _hoisted_5$e = { class: "proposal-header" };
  const _hoisted_6$b = { class: "proposal-id" };
  const _hoisted_7$a = { class: "proposal-title" };
  const _hoisted_8$8 = { class: "proposal-meta" };
  const _hoisted_9$8 = { class: "meta-item" };
  const _hoisted_10$8 = {
    key: 0,
    class: "meta-item action-type"
  };
  const _hoisted_11$5 = {
    key: 1,
    class: "meta-item action-type"
  };
  const _hoisted_12$4 = { class: "meta-item" };
  const _sfc_main$k = /* @__PURE__ */ defineComponent({
    __name: "ActionsNeededTab",
    props: {
      actionsNeeded: {},
      currentUserAddress: {}
    },
    emits: ["open-proposal"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$k, [
          _ctx.actionsNeeded.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_2$j, [..._cache[0] || (_cache[0] = [
            createBaseVNode("div", { class: "empty-icon" }, "✅", -1),
            createBaseVNode("h3", null, "All caught up!", -1),
            createBaseVNode("p", null, "You have no pending actions", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_3$j, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.actionsNeeded, (proposal) => {
              return openBlock(), createElementBlock("div", {
                key: `${proposal.chain}-${proposal.post_id}`,
                class: "proposal-item",
                onClick: ($event) => _ctx.$emit("open-proposal", proposal)
              }, [
                createBaseVNode("div", _hoisted_5$e, [
                  createBaseVNode("span", _hoisted_6$b, "#" + toDisplayString(proposal.post_id), 1),
                  createVNode(StatusBadge, {
                    status: proposal.internal_status,
                    "proposal-id": proposal.post_id,
                    editable: false
                  }, null, 8, ["status", "proposal-id"])
                ]),
                createBaseVNode("h4", _hoisted_7$a, toDisplayString(proposal.title), 1),
                createBaseVNode("div", _hoisted_8$8, [
                  createBaseVNode("div", _hoisted_9$8, [
                    _cache[1] || (_cache[1] = createBaseVNode("strong", null, "Assigned to:", -1)),
                    createTextVNode(" " + toDisplayString(proposal.assigned_to || "Unassigned"), 1)
                  ]),
                  proposal.assigned_to === _ctx.currentUserAddress ? (openBlock(), createElementBlock("div", _hoisted_10$8, [..._cache[2] || (_cache[2] = [
                    createBaseVNode("strong", null, "Action:", -1),
                    createTextVNode(),
                    createBaseVNode("span", { class: "action-badge evaluation" }, "Needs Your Evaluation", -1)
                  ])])) : (openBlock(), createElementBlock("div", _hoisted_11$5, [..._cache[3] || (_cache[3] = [
                    createBaseVNode("strong", null, "Action:", -1),
                    createTextVNode(),
                    createBaseVNode("span", { class: "action-badge team-vote" }, "Needs Your Team Vote", -1)
                  ])])),
                  createBaseVNode("div", _hoisted_12$4, [
                    _cache[4] || (_cache[4] = createBaseVNode("strong", null, "Updated:", -1)),
                    createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                  ])
                ])
              ], 8, _hoisted_4$f);
            }), 128))
          ]))
        ]);
      };
    }
  });
  const ActionsNeededTab = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-c680eda7"]]);
  const _hoisted_1$j = { class: "content-area" };
  const _hoisted_2$i = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_3$i = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_4$e = ["onClick"];
  const _hoisted_5$d = { class: "proposal-header" };
  const _hoisted_6$a = { class: "proposal-id" };
  const _hoisted_7$9 = { class: "proposal-title" };
  const _hoisted_8$7 = { class: "evaluation-info" };
  const _hoisted_9$7 = { class: "vote-recommendation" };
  const _hoisted_10$7 = { class: "vote-badge" };
  const _hoisted_11$4 = {
    key: 0,
    class: "vote-reason"
  };
  const _hoisted_12$3 = { class: "proposal-meta" };
  const _hoisted_13$2 = { class: "meta-item" };
  const _hoisted_14$2 = { class: "meta-item" };
  const _sfc_main$j = /* @__PURE__ */ defineComponent({
    __name: "MyEvaluationsTab",
    props: {
      evaluations: {}
    },
    emits: ["open-proposal"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$j, [
          _ctx.evaluations.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_2$i, [..._cache[0] || (_cache[0] = [
            createBaseVNode("div", { class: "empty-icon" }, "📝", -1),
            createBaseVNode("h3", null, "No evaluations yet", -1),
            createBaseVNode("p", null, "You haven't completed any evaluations", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_3$i, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.evaluations, (proposal) => {
              return openBlock(), createElementBlock("div", {
                key: `${proposal.chain}-${proposal.post_id}`,
                class: "proposal-item",
                onClick: ($event) => _ctx.$emit("open-proposal", proposal)
              }, [
                createBaseVNode("div", _hoisted_5$d, [
                  createBaseVNode("span", _hoisted_6$a, "#" + toDisplayString(proposal.post_id), 1),
                  createVNode(StatusBadge, {
                    status: proposal.internal_status,
                    "proposal-id": proposal.post_id,
                    editable: false
                  }, null, 8, ["status", "proposal-id"])
                ]),
                createBaseVNode("h4", _hoisted_7$9, toDisplayString(proposal.title), 1),
                createBaseVNode("div", _hoisted_8$7, [
                  createBaseVNode("div", _hoisted_9$7, [
                    _cache[1] || (_cache[1] = createBaseVNode("strong", null, "Your Recommendation:", -1)),
                    createBaseVNode("span", _hoisted_10$7, toDisplayString(proposal.suggested_vote), 1)
                  ]),
                  proposal.reason_for_vote ? (openBlock(), createElementBlock("div", _hoisted_11$4, [
                    _cache[2] || (_cache[2] = createBaseVNode("strong", null, "Reason:", -1)),
                    createTextVNode(" " + toDisplayString(proposal.reason_for_vote), 1)
                  ])) : createCommentVNode("", true)
                ]),
                createBaseVNode("div", _hoisted_12$3, [
                  createBaseVNode("div", _hoisted_13$2, [
                    _cache[3] || (_cache[3] = createBaseVNode("strong", null, "Timeline:", -1)),
                    createTextVNode(" " + toDisplayString(proposal.referendum_timeline || "Unknown"), 1)
                  ]),
                  createBaseVNode("div", _hoisted_14$2, [
                    _cache[4] || (_cache[4] = createBaseVNode("strong", null, "Updated:", -1)),
                    createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                  ])
                ])
              ], 8, _hoisted_4$e);
            }), 128))
          ]))
        ]);
      };
    }
  });
  const MyEvaluationsTab = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-9dd5dc87"]]);
  const _hoisted_1$i = { class: "content-area" };
  const _sfc_main$i = /* @__PURE__ */ defineComponent({
    __name: "MyActivityTab",
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$i, [..._cache[0] || (_cache[0] = [
          createBaseVNode("div", { class: "empty-state" }, [
            createBaseVNode("div", { class: "empty-icon" }, "🚧"),
            createBaseVNode("h3", null, "Coming Soon"),
            createBaseVNode("p", null, "Activity tracking will be available in a future update")
          ], -1)
        ])]);
      };
    }
  });
  const MyActivityTab = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-a4d8a9e4"]]);
  const _hoisted_1$h = { class: "my-dashboard" };
  const _hoisted_2$h = {
    key: 0,
    class: "loading-state"
  };
  const _hoisted_3$h = {
    key: 1,
    class: "error-state"
  };
  const _hoisted_4$d = { class: "stats-section" };
  const _hoisted_5$c = { class: "stats-section-container" };
  const _hoisted_6$9 = { class: "stat-number" };
  const _hoisted_7$8 = { class: "stat-number" };
  const _hoisted_8$6 = { class: "stat-number" };
  const _hoisted_9$6 = { class: "stat-number" };
  const _hoisted_10$6 = { class: "content-section" };
  const MAX_RETRIES$1 = 3;
  const RETRY_DELAY$1 = 1e3;
  const _sfc_main$h = /* @__PURE__ */ defineComponent({
    __name: "MyDashboard",
    setup(__props) {
      const activeTab = ref("assignments");
      const dashboardProposals = ref([]);
      const allProposals = ref([]);
      const recentActivity = ref([]);
      const myAssignments2 = computed(() => {
        var _a;
        const currentUser = (_a = authStore.state.user) == null ? void 0 : _a.address;
        if (!currentUser) return [];
        return dashboardProposals.value.filter((p2) => p2.assigned_to === currentUser);
      });
      const actionsNeeded2 = computed(() => {
        var _a;
        const currentUser = (_a = authStore.state.user) == null ? void 0 : _a.address;
        if (!currentUser) return [];
        return allProposals.value.filter((p2) => {
          var _a2;
          const isAssignedToMe = p2.assigned_to === currentUser;
          if (isAssignedToMe) {
            return !p2.suggested_vote;
          }
          const inActionableStatus = ["Considering", "Ready for approval", "Waiting for agreement"].includes(p2.internal_status);
          if (!inActionableStatus) {
            return false;
          }
          const hasTeamAction = (_a2 = p2.team_actions) == null ? void 0 : _a2.some(
            (action) => action.wallet_address === currentUser && ["Agree", "NO WAY", "Recuse", "To be discussed", "agree", "no_way", "recuse", "to_be_discussed"].includes(action.role_type)
          );
          return !hasTeamAction;
        });
      });
      const myEvaluations2 = computed(() => {
        var _a;
        const currentUser = (_a = authStore.state.user) == null ? void 0 : _a.address;
        if (!currentUser) return [];
        return dashboardProposals.value.filter(
          (p2) => p2.assigned_to === currentUser && p2.suggested_vote
        );
      });
      const activityCount = computed(() => recentActivity.value.length);
      const loading = ref(false);
      const error = ref(null);
      const sleep2 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const loadData = async (retryCount = 0) => {
        var _a;
        loading.value = true;
        error.value = null;
        try {
          if (!authStore.state.isAuthenticated || !((_a = authStore.state.user) == null ? void 0 : _a.address)) {
            return;
          }
          const apiService = ApiService.getInstance();
          const assignments = await apiService.getMyAssignments();
          if (!assignments) {
            if (retryCount < MAX_RETRIES$1) {
              console.log(`Retrying data load (attempt ${retryCount + 1}/${MAX_RETRIES$1})...`);
              await sleep2(RETRY_DELAY$1);
              return loadData(retryCount + 1);
            }
            throw new Error("Could not load assignments after multiple attempts.");
          }
          const all = await apiService.getAllProposals();
          if (!all) {
            if (retryCount < MAX_RETRIES$1) {
              console.log(`Retrying all proposals load (attempt ${retryCount + 1}/${MAX_RETRIES$1})...`);
              await sleep2(RETRY_DELAY$1);
              return loadData(retryCount + 1);
            }
            throw new Error("Could not load all proposals after multiple attempts.");
          }
          dashboardProposals.value = assignments;
          allProposals.value = all;
        } catch (err) {
          console.error("Failed to load dashboard data:", err);
          error.value = err instanceof Error ? err.message : "Failed to load data. Please try again.";
          dashboardProposals.value = [];
          allProposals.value = [];
          recentActivity.value = [];
        } finally {
          loading.value = false;
        }
      };
      const openProposal = async (proposal) => {
        try {
          const apiService = ApiService.getInstance();
          const existingProposal = await apiService.getProposal(proposal.post_id, proposal.chain);
          if (!existingProposal) {
            await apiService.refreshReferenda();
          }
          const url = `https://${proposal.chain.toLowerCase()}.polkassembly.io/referenda/${proposal.post_id}`;
          window.open(url, "_blank");
        } catch (error2) {
          console.error("Failed to open proposal:", error2);
        }
      };
      const handleTeamActionChanged = () => {
        console.log("Team action changed - refreshing dashboard data...");
        loadData();
      };
      const handleProposalAssigned = () => {
        console.log("Proposal assigned - refreshing dashboard data...");
        loadData();
      };
      const handleProposalUnassigned = () => {
        console.log("Proposal unassigned - refreshing dashboard data...");
        loadData();
      };
      const handleSuggestedVoteChanged = () => {
        console.log("Suggested vote changed - refreshing dashboard data...");
        loadData();
      };
      const handleStatusChanged = () => {
        console.log("Status changed - refreshing dashboard data...");
        loadData();
      };
      watch(() => authStore.state.isAuthenticated, (isAuthenticated) => {
        if (isAuthenticated) {
          loadData();
        }
      });
      onMounted(() => {
        if (authStore.state.isAuthenticated) {
          loadData();
        }
        window.addEventListener("teamActionChanged", handleTeamActionChanged);
        window.addEventListener("proposalAssigned", handleProposalAssigned);
        window.addEventListener("proposalUnassigned", handleProposalUnassigned);
        window.addEventListener("suggestedVoteChanged", handleSuggestedVoteChanged);
        window.addEventListener("statusChanged", handleStatusChanged);
      });
      onUnmounted(() => {
        window.removeEventListener("teamActionChanged", handleTeamActionChanged);
        window.removeEventListener("proposalAssigned", handleProposalAssigned);
        window.removeEventListener("proposalUnassigned", handleProposalUnassigned);
        window.removeEventListener("suggestedVoteChanged", handleSuggestedVoteChanged);
        window.removeEventListener("statusChanged", handleStatusChanged);
      });
      return (_ctx, _cache) => {
        var _a;
        return openBlock(), createElementBlock("div", _hoisted_1$h, [
          loading.value ? (openBlock(), createElementBlock("div", _hoisted_2$h, [..._cache[5] || (_cache[5] = [
            createBaseVNode("div", { class: "loading-spinner" }, null, -1),
            createBaseVNode("p", null, "Loading your assignments...", -1)
          ])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_3$h, [
            _cache[6] || (_cache[6] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)),
            _cache[7] || (_cache[7] = createBaseVNode("h3", null, "Error Loading Data", -1)),
            createBaseVNode("p", null, toDisplayString(error.value), 1),
            createBaseVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => loadData()),
              class: "retry-btn"
            }, "Try Again")
          ])) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            createBaseVNode("div", _hoisted_4$d, [
              createBaseVNode("div", _hoisted_5$c, [
                createBaseVNode("div", {
                  class: normalizeClass(["stat-card", { active: activeTab.value === "assignments" }]),
                  onClick: _cache[1] || (_cache[1] = ($event) => activeTab.value = "assignments")
                }, [
                  createBaseVNode("div", _hoisted_6$9, toDisplayString(myAssignments2.value.length), 1),
                  _cache[8] || (_cache[8] = createBaseVNode("div", { class: "stat-label" }, "My Assignments", -1))
                ], 2),
                createBaseVNode("div", {
                  class: normalizeClass(["stat-card", { active: activeTab.value === "actions" }]),
                  onClick: _cache[2] || (_cache[2] = ($event) => activeTab.value = "actions")
                }, [
                  createBaseVNode("div", _hoisted_7$8, toDisplayString(actionsNeeded2.value.length), 1),
                  _cache[9] || (_cache[9] = createBaseVNode("div", { class: "stat-label" }, "Actions Needed", -1))
                ], 2),
                createBaseVNode("div", {
                  class: normalizeClass(["stat-card", { active: activeTab.value === "evaluations" }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => activeTab.value = "evaluations")
                }, [
                  createBaseVNode("div", _hoisted_8$6, toDisplayString(myEvaluations2.value.length), 1),
                  _cache[10] || (_cache[10] = createBaseVNode("div", { class: "stat-label" }, "My Evaluations", -1))
                ], 2),
                createBaseVNode("div", {
                  class: normalizeClass(["stat-card", { active: activeTab.value === "activity" }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => activeTab.value = "activity")
                }, [
                  createBaseVNode("div", _hoisted_9$6, toDisplayString(activityCount.value), 1),
                  _cache[11] || (_cache[11] = createBaseVNode("div", { class: "stat-label" }, "My Activity", -1))
                ], 2)
              ])
            ]),
            createBaseVNode("div", _hoisted_10$6, [
              activeTab.value === "assignments" ? (openBlock(), createBlock(MyAssignmentsTab, {
                key: 0,
                assignments: myAssignments2.value,
                onOpenProposal: openProposal
              }, null, 8, ["assignments"])) : createCommentVNode("", true),
              activeTab.value === "actions" ? (openBlock(), createBlock(ActionsNeededTab, {
                key: 1,
                "actions-needed": actionsNeeded2.value,
                "current-user-address": ((_a = unref(authStore).state.user) == null ? void 0 : _a.address) || null,
                onOpenProposal: openProposal
              }, null, 8, ["actions-needed", "current-user-address"])) : createCommentVNode("", true),
              activeTab.value === "evaluations" ? (openBlock(), createBlock(MyEvaluationsTab, {
                key: 2,
                evaluations: myEvaluations2.value,
                onOpenProposal: openProposal
              }, null, 8, ["evaluations"])) : createCommentVNode("", true),
              activeTab.value === "activity" ? (openBlock(), createBlock(MyActivityTab, { key: 3 })) : createCommentVNode("", true)
            ])
          ], 64))
        ]);
      };
    }
  });
  const MyDashboard = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-f4aa978b"]]);
  const _hoisted_1$g = { class: "proposal-header" };
  const _hoisted_2$g = { class: "proposal-id" };
  const _hoisted_3$g = { class: "proposal-title" };
  const _hoisted_4$c = {
    key: 0,
    class: "agreement-progress"
  };
  const _hoisted_5$b = { class: "progress-header" };
  const _hoisted_6$8 = { class: "progress-count" };
  const _hoisted_7$7 = { class: "progress-bar" };
  const _hoisted_8$5 = {
    key: 1,
    class: "team-status"
  };
  const _hoisted_9$5 = { class: "status-section" };
  const _hoisted_10$5 = { class: "member-list" };
  const _hoisted_11$3 = {
    key: 0,
    class: "no-members"
  };
  const _hoisted_12$2 = {
    key: 2,
    class: "voting-info"
  };
  const _hoisted_13$1 = { class: "vote-recommendation" };
  const _hoisted_14$1 = { class: "vote-badge" };
  const _hoisted_15$1 = {
    key: 0,
    class: "vote-reason"
  };
  const _hoisted_16$1 = {
    key: 3,
    class: "discussion-info"
  };
  const _hoisted_17$1 = { class: "discussion-members" };
  const _hoisted_18$1 = { class: "member-list" };
  const _hoisted_19$1 = {
    key: 4,
    class: "veto-info"
  };
  const _hoisted_20$1 = { class: "veto-alert" };
  const _hoisted_21$1 = {
    key: 0,
    class: "veto-reason"
  };
  const _hoisted_22$1 = {
    key: 1,
    class: "veto-date"
  };
  const _hoisted_23$1 = { class: "proposal-meta" };
  const _hoisted_24$1 = {
    key: 0,
    class: "meta-item"
  };
  const _hoisted_25$1 = {
    key: 1,
    class: "meta-item"
  };
  const _hoisted_26$1 = { class: "meta-item" };
  const _sfc_main$g = /* @__PURE__ */ defineComponent({
    __name: "ProposalItem",
    props: {
      proposal: {},
      type: { default: "default" },
      editable: { type: Boolean, default: false },
      showEvaluator: { type: Boolean, default: true },
      showSuggestedVote: { type: Boolean, default: true },
      requiredAgreements: { default: 4 },
      agreedMembers: { default: () => [] },
      agreementCount: { default: 0 },
      discussionMembers: { default: () => [] }
    },
    emits: ["click"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["proposal-item", {
            "agreement-item": _ctx.type === "agreement",
            "ready-item": _ctx.type === "ready",
            "discussion-item": _ctx.type === "discussion",
            "vetoed-item": _ctx.type === "vetoed"
          }]),
          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", _ctx.proposal))
        }, [
          createBaseVNode("div", _hoisted_1$g, [
            createBaseVNode("span", _hoisted_2$g, "#" + toDisplayString(_ctx.proposal.post_id), 1),
            createVNode(StatusBadge, {
              status: _ctx.proposal.internal_status,
              "proposal-id": _ctx.proposal.post_id,
              editable: _ctx.editable
            }, null, 8, ["status", "proposal-id", "editable"])
          ]),
          createBaseVNode("h4", _hoisted_3$g, toDisplayString(_ctx.proposal.title), 1),
          _ctx.type === "agreement" ? (openBlock(), createElementBlock("div", _hoisted_4$c, [
            createBaseVNode("div", _hoisted_5$b, [
              _cache[1] || (_cache[1] = createBaseVNode("span", null, "Agreement Progress", -1)),
              createBaseVNode("span", _hoisted_6$8, toDisplayString(_ctx.agreementCount) + "/" + toDisplayString(_ctx.requiredAgreements), 1)
            ]),
            createBaseVNode("div", _hoisted_7$7, [
              createBaseVNode("div", {
                class: "progress-fill",
                style: normalizeStyle({
                  width: `${Math.min(_ctx.agreementCount / _ctx.requiredAgreements * 100, 100)}%`,
                  backgroundColor: _ctx.agreementCount >= _ctx.requiredAgreements ? "#28a745" : "#ffc107"
                })
              }, null, 4)
            ])
          ])) : createCommentVNode("", true),
          _ctx.type === "agreement" ? (openBlock(), createElementBlock("div", _hoisted_8$5, [
            createBaseVNode("div", _hoisted_9$5, [
              _cache[2] || (_cache[2] = createBaseVNode("h5", null, "Agreed Members", -1)),
              createBaseVNode("div", _hoisted_10$5, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.agreedMembers, (member) => {
                  return openBlock(), createElementBlock("span", {
                    key: member.address,
                    class: "member-badge agreed"
                  }, toDisplayString(member.name), 1);
                }), 128)),
                _ctx.agreedMembers.length === 0 ? (openBlock(), createElementBlock("span", _hoisted_11$3, "None yet")) : createCommentVNode("", true)
              ])
            ])
          ])) : createCommentVNode("", true),
          _ctx.type === "ready" ? (openBlock(), createElementBlock("div", _hoisted_12$2, [
            createBaseVNode("div", _hoisted_13$1, [
              _cache[3] || (_cache[3] = createBaseVNode("strong", null, "Team Recommendation:", -1)),
              createBaseVNode("span", _hoisted_14$1, toDisplayString(_ctx.proposal.suggested_vote || "Not set"), 1)
            ]),
            _ctx.proposal.reason_for_vote ? (openBlock(), createElementBlock("div", _hoisted_15$1, [
              _cache[4] || (_cache[4] = createBaseVNode("strong", null, "Reason:", -1)),
              createTextVNode(" " + toDisplayString(_ctx.proposal.reason_for_vote), 1)
            ])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true),
          _ctx.type === "discussion" ? (openBlock(), createElementBlock("div", _hoisted_16$1, [
            createBaseVNode("div", _hoisted_17$1, [
              _cache[5] || (_cache[5] = createBaseVNode("strong", null, "Marked for discussion by:", -1)),
              createBaseVNode("div", _hoisted_18$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.discussionMembers, (member) => {
                  return openBlock(), createElementBlock("span", {
                    key: member.address,
                    class: "member-badge discussion"
                  }, toDisplayString(member.name), 1);
                }), 128))
              ])
            ])
          ])) : createCommentVNode("", true),
          _ctx.type === "vetoed" ? (openBlock(), createElementBlock("div", _hoisted_19$1, [
            createBaseVNode("div", _hoisted_20$1, [
              _cache[6] || (_cache[6] = createBaseVNode("span", { class: "alert-icon" }, "🚫", -1)),
              _cache[7] || (_cache[7] = createBaseVNode("strong", null, "NO WAYed by:", -1)),
              createTextVNode(" " + toDisplayString(_ctx.proposal.veto_by_name || _ctx.proposal.veto_by), 1)
            ]),
            _ctx.proposal.veto_reason ? (openBlock(), createElementBlock("div", _hoisted_21$1, [
              _cache[8] || (_cache[8] = createBaseVNode("strong", null, "Reason:", -1)),
              createTextVNode(" " + toDisplayString(_ctx.proposal.veto_reason), 1)
            ])) : createCommentVNode("", true),
            _ctx.proposal.veto_date ? (openBlock(), createElementBlock("div", _hoisted_22$1, [
              _cache[9] || (_cache[9] = createBaseVNode("strong", null, "NO WAYed on:", -1)),
              createTextVNode(" " + toDisplayString(unref(formatDate)(_ctx.proposal.veto_date)), 1)
            ])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_23$1, [
            _ctx.showEvaluator ? (openBlock(), createElementBlock("div", _hoisted_24$1, [
              _cache[10] || (_cache[10] = createBaseVNode("strong", null, "Evaluator:", -1)),
              createTextVNode(" " + toDisplayString(_ctx.proposal.assigned_to || "Unassigned"), 1)
            ])) : createCommentVNode("", true),
            _ctx.showSuggestedVote ? (openBlock(), createElementBlock("div", _hoisted_25$1, [
              _cache[11] || (_cache[11] = createBaseVNode("strong", null, "Suggested Vote:", -1)),
              createTextVNode(" " + toDisplayString(_ctx.proposal.suggested_vote || "Not set"), 1)
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_26$1, [
              _cache[12] || (_cache[12] = createBaseVNode("strong", null, "Updated:", -1)),
              createTextVNode(" " + toDisplayString(unref(formatDate)(_ctx.proposal.updated_at || _ctx.proposal.created_at)), 1)
            ])
          ])
        ], 2);
      };
    }
  });
  const ProposalItem = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-1a03f392"]]);
  const _hoisted_1$f = { class: "content-area" };
  const _hoisted_2$f = { class: "panel-header" };
  const _hoisted_3$f = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_4$b = {
    key: 1,
    class: "proposals-list"
  };
  const _sfc_main$f = /* @__PURE__ */ defineComponent({
    __name: "NeedsAgreementTab",
    props: {
      needsAgreement: {},
      requiredAgreements: {}
    },
    emits: ["open-proposal"],
    setup(__props) {
      const parseTeamActions = (proposal) => {
        if (!proposal.team_actions) return [];
        if (Array.isArray(proposal.team_actions)) {
          return proposal.team_actions;
        }
        return proposal.team_actions.split(",").map((actionStr) => {
          const [team_member_id, role_type, reason, created_at] = actionStr.split(":");
          return {
            team_member_id,
            wallet_address: team_member_id,
            // For compatibility
            role_type,
            reason,
            created_at,
            team_member_name: teamStore.getTeamMemberName(team_member_id)
          };
        });
      };
      const getAgreementCount = (proposal) => {
        const actions = parseTeamActions(proposal);
        return actions.filter(
          (action) => {
            var _a;
            return ((_a = action.role_type) == null ? void 0 : _a.toLowerCase()) === "agree";
          }
        ).length;
      };
      const getAgreedMembers = (proposal) => {
        const actions = parseTeamActions(proposal);
        const agreeActions = actions.filter(
          (action) => {
            var _a;
            return ((_a = action.role_type) == null ? void 0 : _a.toLowerCase()) === "agree";
          }
        );
        return agreeActions.map((action) => ({
          name: action.team_member_name || teamStore.getTeamMemberName(action.team_member_id),
          address: action.team_member_id
        }));
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$f, [
          createBaseVNode("div", _hoisted_2$f, [
            _cache[0] || (_cache[0] = createBaseVNode("h3", null, "Proposals Waiting for Team Agreement", -1)),
            createBaseVNode("p", null, "These proposals need " + toDisplayString(_ctx.requiredAgreements) + " team member agreements to proceed to voting.", 1)
          ]),
          _ctx.needsAgreement.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_3$f, [..._cache[1] || (_cache[1] = [
            createBaseVNode("div", { class: "empty-icon" }, "✅", -1),
            createBaseVNode("h3", null, "All caught up!", -1),
            createBaseVNode("p", null, "No proposals are waiting for agreement", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_4$b, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.needsAgreement, (proposal) => {
              return openBlock(), createBlock(ProposalItem, {
                key: `${proposal.chain}-${proposal.post_id}`,
                proposal,
                type: "agreement",
                editable: true,
                "required-agreements": _ctx.requiredAgreements,
                "agreed-members": getAgreedMembers(proposal),
                "agreement-count": getAgreementCount(proposal),
                onClick: ($event) => _ctx.$emit("open-proposal", proposal)
              }, null, 8, ["proposal", "required-agreements", "agreed-members", "agreement-count", "onClick"]);
            }), 128))
          ]))
        ]);
      };
    }
  });
  const NeedsAgreementTab = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-bddfa2c9"]]);
  const _hoisted_1$e = { class: "content-area" };
  const _hoisted_2$e = { class: "panel-header" };
  const _hoisted_3$e = ["disabled"];
  const _hoisted_4$a = {
    key: 0,
    class: "loading-spinner"
  };
  const _hoisted_5$a = { key: 1 };
  const _hoisted_6$7 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_7$6 = {
    key: 1,
    class: "proposals-list"
  };
  const _sfc_main$e = /* @__PURE__ */ defineComponent({
    __name: "ReadyToVoteTab",
    props: {
      readyToVote: {},
      sendingToMimir: { type: Boolean }
    },
    emits: ["open-proposal", "send-to-mimir"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$e, [
          createBaseVNode("div", _hoisted_2$e, [
            _cache[1] || (_cache[1] = createBaseVNode("h3", null, "Proposals Ready for Voting", -1)),
            _cache[2] || (_cache[2] = createBaseVNode("p", null, "These proposals have received sufficient team agreement and are ready for on-chain voting.", -1)),
            createBaseVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("send-to-mimir")),
              disabled: _ctx.sendingToMimir || _ctx.readyToVote.length === 0,
              class: "send-to-mimir-btn"
            }, [
              _ctx.sendingToMimir ? (openBlock(), createElementBlock("span", _hoisted_4$a)) : (openBlock(), createElementBlock("span", _hoisted_5$a, "Send to Mimir"))
            ], 8, _hoisted_3$e)
          ]),
          _ctx.readyToVote.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_6$7, [..._cache[3] || (_cache[3] = [
            createBaseVNode("div", { class: "empty-icon" }, "🗳️", -1),
            createBaseVNode("h3", null, "No proposals ready", -1),
            createBaseVNode("p", null, "No proposals are currently ready for voting", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_7$6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.readyToVote, (proposal) => {
              return openBlock(), createBlock(ProposalItem, {
                key: `${proposal.chain}-${proposal.post_id}`,
                proposal,
                type: "ready",
                editable: false,
                onClick: ($event) => _ctx.$emit("open-proposal", proposal)
              }, null, 8, ["proposal", "onClick"]);
            }), 128))
          ]))
        ]);
      };
    }
  });
  const ReadyToVoteTab = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-aac09e73"]]);
  const _hoisted_1$d = { class: "content-area" };
  const _hoisted_2$d = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_3$d = {
    key: 1,
    class: "proposals-list"
  };
  const _sfc_main$d = /* @__PURE__ */ defineComponent({
    __name: "ForDiscussionTab",
    props: {
      forDiscussion: {}
    },
    emits: ["open-proposal"],
    setup(__props) {
      const parseTeamActions = (proposal) => {
        if (!proposal.team_actions) return [];
        if (Array.isArray(proposal.team_actions)) {
          return proposal.team_actions;
        }
        return proposal.team_actions.split(",").map((actionStr) => {
          const [team_member_id, role_type, reason, created_at] = actionStr.split(":");
          return {
            team_member_id,
            wallet_address: team_member_id,
            // For compatibility
            role_type,
            reason,
            created_at,
            team_member_name: teamStore.getTeamMemberName(team_member_id)
          };
        });
      };
      const getDiscussionMembers = (proposal) => {
        const actions = parseTeamActions(proposal);
        const discussionActions = actions.filter(
          (action) => action.role_type === "to_be_discussed"
        );
        return discussionActions.map((action) => ({
          name: action.team_member_name || teamStore.getTeamMemberName(action.team_member_id),
          address: action.team_member_id
        }));
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$d, [
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "panel-header" }, [
            createBaseVNode("h3", null, "Proposals for Team Discussion"),
            createBaseVNode("p", null, "These proposals have been marked for team discussion before proceeding.")
          ], -1)),
          _ctx.forDiscussion.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_2$d, [..._cache[0] || (_cache[0] = [
            createBaseVNode("div", { class: "empty-icon" }, "💬", -1),
            createBaseVNode("h3", null, "No discussions needed", -1),
            createBaseVNode("p", null, "No proposals are marked for discussion", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_3$d, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.forDiscussion, (proposal) => {
              return openBlock(), createBlock(ProposalItem, {
                key: `${proposal.chain}-${proposal.post_id}`,
                proposal,
                type: "discussion",
                editable: false,
                "discussion-members": getDiscussionMembers(proposal),
                onClick: ($event) => _ctx.$emit("open-proposal", proposal)
              }, null, 8, ["proposal", "discussion-members", "onClick"]);
            }), 128))
          ]))
        ]);
      };
    }
  });
  const ForDiscussionTab = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-2e7af979"]]);
  const _hoisted_1$c = { class: "content-area" };
  const _hoisted_2$c = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_3$c = {
    key: 1,
    class: "proposals-list"
  };
  const _sfc_main$c = /* @__PURE__ */ defineComponent({
    __name: "VetoedTab",
    props: {
      vetoed: {}
    },
    emits: ["open-proposal"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$c, [
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "panel-header" }, [
            createBaseVNode("h3", null, "NO WAYed Proposals"),
            createBaseVNode("p", null, "These proposals have been vetoed by team members.")
          ], -1)),
          _ctx.vetoed.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_2$c, [..._cache[0] || (_cache[0] = [
            createBaseVNode("div", { class: "empty-icon" }, "🚫", -1),
            createBaseVNode("h3", null, "No vetoed proposals", -1),
            createBaseVNode("p", null, "No proposals have been NO WAYed", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_3$c, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.vetoed, (proposal) => {
              return openBlock(), createBlock(ProposalItem, {
                key: `${proposal.chain}-${proposal.post_id}`,
                proposal,
                type: "vetoed",
                editable: false,
                onClick: ($event) => _ctx.$emit("open-proposal", proposal)
              }, null, 8, ["proposal", "onClick"]);
            }), 128))
          ]))
        ]);
      };
    }
  });
  const VetoedTab = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-03d5c226"]]);
  const _hoisted_1$b = { class: "modal-header" };
  const _hoisted_2$b = { class: "modal-body" };
  const _hoisted_3$b = { class: "modal-actions" };
  const _sfc_main$b = /* @__PURE__ */ defineComponent({
    __name: "AlertModal",
    props: {
      show: { type: Boolean },
      title: {},
      message: {},
      okText: { default: "OK" },
      type: { default: "info" }
    },
    emits: ["ok"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const icon = computed(() => {
        switch (props.type) {
          case "success":
            return "✅";
          case "error":
            return "❌";
          case "warning":
            return "⚠️";
          default:
            return "ℹ️";
        }
      });
      const iconClass = computed(() => {
        return `icon-${props.type}`;
      });
      const buttonClass = computed(() => {
        switch (props.type) {
          case "success":
            return "success";
          case "error":
            return "error";
          case "warning":
            return "warning";
          default:
            return "info";
        }
      });
      const handleOk = () => {
        emit2("ok");
      };
      const handleOverlayClick = () => {
        emit2("ok");
      };
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: handleOverlayClick
        }, [
          createBaseVNode("div", {
            class: "modal-content",
            onClick: _cache[0] || (_cache[0] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$b, [
              createBaseVNode("div", {
                class: normalizeClass(["icon", iconClass.value])
              }, toDisplayString(icon.value), 3),
              createBaseVNode("h3", null, toDisplayString(_ctx.title), 1)
            ]),
            createBaseVNode("div", _hoisted_2$b, [
              createBaseVNode("p", null, toDisplayString(_ctx.message), 1)
            ]),
            createBaseVNode("div", _hoisted_3$b, [
              createBaseVNode("button", {
                onClick: handleOk,
                class: normalizeClass(["ok-btn", buttonClass.value])
              }, toDisplayString(_ctx.okText), 3)
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const AlertModal = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-cafa1a99"]]);
  const _hoisted_1$a = { class: "workflow" };
  const _hoisted_2$a = {
    key: 0,
    class: "loading-state"
  };
  const _hoisted_3$a = {
    key: 1,
    class: "error-state"
  };
  const _hoisted_4$9 = { class: "stats-section" };
  const _hoisted_5$9 = { class: "stats-section-container" };
  const _hoisted_6$6 = { class: "stat-number" };
  const _hoisted_7$5 = { class: "stat-number" };
  const _hoisted_8$4 = { class: "stat-number" };
  const _hoisted_9$4 = { class: "stat-number" };
  const _hoisted_10$4 = { class: "content-section" };
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1e3;
  const _sfc_main$a = /* @__PURE__ */ defineComponent({
    __name: "Workflow",
    setup(__props) {
      const activeTab = ref("agreement");
      const loading = ref(false);
      const error = ref(null);
      const workflowData = ref({
        needsAgreement: [],
        readyToVote: [],
        forDiscussion: [],
        vetoed: []
      });
      const requiredAgreements = computed(() => {
        var _a;
        return ((_a = teamStore.daoConfig) == null ? void 0 : _a.required_agreements) || 4;
      });
      const needsAgreement = computed(() => workflowData.value.needsAgreement);
      const readyToVote = computed(() => workflowData.value.readyToVote);
      const forDiscussion = computed(() => workflowData.value.forDiscussion);
      const vetoed = computed(() => workflowData.value.vetoed);
      const sleep2 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const loadData = async (retryCount = 0) => {
        loading.value = true;
        error.value = null;
        try {
          const apiService = ApiService.getInstance();
          const daoConfig = await apiService.getDAOConfig();
          if (!daoConfig) {
            if (retryCount < MAX_RETRIES) {
              console.log(`Retrying DAO config load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
              await sleep2(RETRY_DELAY);
              return loadData(retryCount + 1);
            }
            throw new Error("Could not load team configuration after multiple attempts.");
          }
          teamStore.setTeamMembers(daoConfig.team_members);
          const data = await apiService.getTeamWorkflowData();
          if (!data) {
            if (retryCount < MAX_RETRIES) {
              console.log(`Retrying workflow data load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
              await sleep2(RETRY_DELAY);
              return loadData(retryCount + 1);
            }
            throw new Error("Could not load workflow data after multiple attempts.");
          }
          workflowData.value = {
            needsAgreement: data.needsAgreement,
            readyToVote: data.readyToVote,
            forDiscussion: data.forDiscussion,
            vetoed: data.vetoedProposals
          };
        } catch (err) {
          console.error("Error loading team workflow data:", err);
          error.value = err instanceof Error ? err.message : "Failed to load data. Please try again.";
        } finally {
          loading.value = false;
        }
      };
      const openProposal = async (proposal) => {
        try {
          const url = `https://${proposal.chain.toLowerCase()}.polkassembly.io/referenda/${proposal.post_id}`;
          window.open(url, "_blank");
        } catch (error2) {
          console.error("Failed to open proposal:", error2);
          showAlert(
            "Error",
            "Failed to open proposal. Please try again.",
            "error"
          );
        }
      };
      const showAlertModal = ref(false);
      const alertModalData = ref({
        title: "",
        message: "",
        type: "info"
      });
      const showAlert = (title, message, type = "info") => {
        alertModalData.value = { title, message, type };
        showAlertModal.value = true;
      };
      const sendingToMimir = ref(false);
      const sendToMimir = () => {
        if (sendingToMimir.value) return;
        sendingToMimir.value = true;
        chrome.runtime.sendMessage({
          type: "VOTING_TOOL_API_CALL",
          messageId: Date.now().toString(),
          endpoint: "/send-to-mimir",
          method: "GET",
          data: void 0,
          headers: {}
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending to Mimir:", chrome.runtime.lastError);
            showAlert(
              "Error",
              "Failed to send proposals to Mimir. Please try again.",
              "error"
            );
            sendingToMimir.value = false;
            return;
          }
          if (!(response == null ? void 0 : response.success)) {
            console.error("Error sending to Mimir:", response == null ? void 0 : response.error);
            showAlert(
              "Error",
              "Failed to send proposals to Mimir. Please try again.",
              "error"
            );
          } else {
            showAlert(
              "Success",
              "Successfully sent proposals to Mimir!",
              "success"
            );
          }
          sendingToMimir.value = false;
        });
      };
      onMounted(loadData);
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock(Fragment, null, [
          createBaseVNode("div", _hoisted_1$a, [
            loading.value ? (openBlock(), createElementBlock("div", _hoisted_2$a, [..._cache[5] || (_cache[5] = [
              createBaseVNode("div", { class: "loading-spinner" }, null, -1),
              createBaseVNode("p", null, "Loading team workflow data...", -1)
            ])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_3$a, [
              _cache[6] || (_cache[6] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)),
              _cache[7] || (_cache[7] = createBaseVNode("h3", null, "Error Loading Data", -1)),
              createBaseVNode("p", null, toDisplayString(error.value), 1),
              createBaseVNode("button", {
                onClick: loadData,
                class: "retry-btn"
              }, "Try Again")
            ])) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
              createBaseVNode("div", _hoisted_4$9, [
                createBaseVNode("div", _hoisted_5$9, [
                  createBaseVNode("div", {
                    class: normalizeClass(["stat-card", { active: activeTab.value === "agreement" }]),
                    onClick: _cache[0] || (_cache[0] = ($event) => activeTab.value = "agreement")
                  }, [
                    createBaseVNode("div", _hoisted_6$6, toDisplayString(needsAgreement.value.length), 1),
                    _cache[8] || (_cache[8] = createBaseVNode("div", { class: "stat-label" }, "Needs Agreement", -1))
                  ], 2),
                  createBaseVNode("div", {
                    class: normalizeClass(["stat-card", { active: activeTab.value === "ready" }]),
                    onClick: _cache[1] || (_cache[1] = ($event) => activeTab.value = "ready")
                  }, [
                    createBaseVNode("div", _hoisted_7$5, toDisplayString(readyToVote.value.length), 1),
                    _cache[9] || (_cache[9] = createBaseVNode("div", { class: "stat-label" }, "Ready to Vote", -1))
                  ], 2),
                  createBaseVNode("div", {
                    class: normalizeClass(["stat-card", { active: activeTab.value === "discussion" }]),
                    onClick: _cache[2] || (_cache[2] = ($event) => activeTab.value = "discussion")
                  }, [
                    createBaseVNode("div", _hoisted_8$4, toDisplayString(forDiscussion.value.length), 1),
                    _cache[10] || (_cache[10] = createBaseVNode("div", { class: "stat-label" }, "For Discussion", -1))
                  ], 2),
                  createBaseVNode("div", {
                    class: normalizeClass(["stat-card", { active: activeTab.value === "vetoed" }]),
                    onClick: _cache[3] || (_cache[3] = ($event) => activeTab.value = "vetoed")
                  }, [
                    createBaseVNode("div", _hoisted_9$4, toDisplayString(vetoed.value.length), 1),
                    _cache[11] || (_cache[11] = createBaseVNode("div", { class: "stat-label" }, "NO WAYed", -1))
                  ], 2)
                ])
              ]),
              createBaseVNode("div", _hoisted_10$4, [
                activeTab.value === "agreement" ? (openBlock(), createBlock(NeedsAgreementTab, {
                  key: 0,
                  "needs-agreement": needsAgreement.value,
                  "required-agreements": requiredAgreements.value,
                  onOpenProposal: openProposal
                }, null, 8, ["needs-agreement", "required-agreements"])) : createCommentVNode("", true),
                activeTab.value === "ready" ? (openBlock(), createBlock(ReadyToVoteTab, {
                  key: 1,
                  "ready-to-vote": readyToVote.value,
                  "sending-to-mimir": sendingToMimir.value,
                  onOpenProposal: openProposal,
                  onSendToMimir: sendToMimir
                }, null, 8, ["ready-to-vote", "sending-to-mimir"])) : createCommentVNode("", true),
                activeTab.value === "discussion" ? (openBlock(), createBlock(ForDiscussionTab, {
                  key: 2,
                  "for-discussion": forDiscussion.value,
                  onOpenProposal: openProposal
                }, null, 8, ["for-discussion"])) : createCommentVNode("", true),
                activeTab.value === "vetoed" ? (openBlock(), createBlock(VetoedTab, {
                  key: 3,
                  vetoed: vetoed.value,
                  onOpenProposal: openProposal
                }, null, 8, ["vetoed"])) : createCommentVNode("", true)
              ])
            ], 64))
          ]),
          createVNode(AlertModal, {
            show: showAlertModal.value,
            title: alertModalData.value.title,
            message: alertModalData.value.message,
            type: alertModalData.value.type,
            onOk: _cache[4] || (_cache[4] = ($event) => showAlertModal.value = false)
          }, null, 8, ["show", "title", "message", "type"])
        ], 64);
      };
    }
  });
  const Workflow = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-b5f0df04"]]);
  const _hoisted_1$9 = { class: "modal-header" };
  const _hoisted_2$9 = { class: "dashboard-content" };
  const _hoisted_3$9 = {
    key: 0,
    class: "auth-required"
  };
  const _hoisted_4$8 = { class: "tab-navigation" };
  const _hoisted_5$8 = { class: "tab-content" };
  const _sfc_main$9 = /* @__PURE__ */ defineComponent({
    __name: "Dashboard",
    props: {
      show: { type: Boolean }
    },
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const handleEscKey = (event) => {
        if (event.key === "Escape" && props.show) {
          emit2("close");
        }
      };
      onMounted(() => {
        window.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        window.removeEventListener("keydown", handleEscKey);
      });
      const activeTab = ref("dashboard");
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "dashboard-modal",
            onClick: _cache[4] || (_cache[4] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$9, [
              _cache[6] || (_cache[6] = createBaseVNode("h2", null, "Dashboard & Workflow", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$9, [
              !unref(authStore).state.isAuthenticated ? (openBlock(), createElementBlock("div", _hoisted_3$9, [
                _cache[7] || (_cache[7] = createBaseVNode("div", { class: "auth-icon" }, "🔐", -1)),
                _cache[8] || (_cache[8] = createBaseVNode("h3", null, "Authentication Required", -1)),
                _cache[9] || (_cache[9] = createBaseVNode("p", null, "Please connect your wallet to view your dashboard", -1)),
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close")),
                  class: "connect-btn"
                }, "Connect Wallet")
              ])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createBaseVNode("div", _hoisted_4$8, [
                  createBaseVNode("button", {
                    class: normalizeClass(["tab-btn", { active: activeTab.value === "dashboard" }]),
                    onClick: _cache[2] || (_cache[2] = ($event) => activeTab.value = "dashboard")
                  }, [..._cache[10] || (_cache[10] = [
                    createBaseVNode("span", { class: "tab-icon" }, "👤", -1),
                    createBaseVNode("span", null, "My Dashboard", -1)
                  ])], 2),
                  createBaseVNode("button", {
                    class: normalizeClass(["tab-btn", { active: activeTab.value === "workflow" }]),
                    onClick: _cache[3] || (_cache[3] = ($event) => activeTab.value = "workflow")
                  }, [..._cache[11] || (_cache[11] = [
                    createBaseVNode("span", { class: "tab-icon" }, "👥", -1),
                    createBaseVNode("span", null, "Team Workflow", -1)
                  ])], 2)
                ]),
                createBaseVNode("div", _hoisted_5$8, [
                  activeTab.value === "dashboard" ? (openBlock(), createBlock(MyDashboard, { key: 0 })) : (openBlock(), createBlock(Workflow, { key: 1 }))
                ])
              ], 64))
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-3b186cf1"]]);
  const _hoisted_1$8 = { class: "menu-container" };
  const _hoisted_2$8 = { class: "user-status" };
  const _hoisted_3$8 = {
    key: 0,
    class: "user-info"
  };
  const _hoisted_4$7 = { class: "user-avatar" };
  const _hoisted_5$7 = { class: "user-details" };
  const _hoisted_6$5 = { class: "user-name" };
  const _hoisted_7$4 = { class: "user-address" };
  const _hoisted_8$3 = { class: "user-network" };
  const _hoisted_9$3 = ["disabled"];
  const _hoisted_10$3 = {
    key: 1,
    class: "login-prompt"
  };
  const _hoisted_11$2 = { class: "menu-items" };
  const _sfc_main$8 = /* @__PURE__ */ defineComponent({
    __name: "Menu",
    setup(__props) {
      const showWalletConnect = ref(false);
      const showDAOConfig = ref(false);
      const showProposalBrowser = ref(false);
      const showUnifiedDashboard = ref(false);
      const showSettingsMore = ref(false);
      const getUserInitials = () => {
        var _a;
        const name = (_a = authStore.state.user) == null ? void 0 : _a.name;
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      };
      const handleLogout = async () => {
        await authStore.logout();
      };
      const handleAction = (action) => {
        switch (action) {
          case "browse-proposals":
            showProposalBrowser.value = true;
            break;
          case "unified-dashboard":
            showUnifiedDashboard.value = true;
            break;
          case "settings-more":
            showSettingsMore.value = true;
            break;
        }
      };
      const handleConfigSaved = () => {
        showDAOConfig.value = false;
      };
      return (_ctx, _cache) => {
        var _a, _b, _c;
        return openBlock(), createElementBlock("div", _hoisted_1$8, [
          createBaseVNode("div", _hoisted_2$8, [
            unref(authStore).state.isAuthenticated ? (openBlock(), createElementBlock("div", _hoisted_3$8, [
              createBaseVNode("div", _hoisted_4$7, toDisplayString(getUserInitials()), 1),
              createBaseVNode("div", _hoisted_5$7, [
                createBaseVNode("div", _hoisted_6$5, toDisplayString(((_a = unref(authStore).state.user) == null ? void 0 : _a.name) || "Unknown User"), 1),
                createBaseVNode("div", _hoisted_7$4, toDisplayString(unref(formatAddress)((_b = unref(authStore).state.user) == null ? void 0 : _b.address)), 1),
                createBaseVNode("div", _hoisted_8$3, toDisplayString((_c = unref(authStore).state.user) == null ? void 0 : _c.network), 1)
              ]),
              createBaseVNode("button", {
                onClick: handleLogout,
                class: "logout-btn",
                disabled: unref(authStore).state.isLoading
              }, toDisplayString(unref(authStore).state.isLoading ? "..." : "Logout"), 9, _hoisted_9$3)
            ])) : (openBlock(), createElementBlock("div", _hoisted_10$3, [
              _cache[11] || (_cache[11] = createBaseVNode("div", { class: "login-icon" }, "🔐", -1)),
              _cache[12] || (_cache[12] = createBaseVNode("div", { class: "login-text" }, "Connect your wallet to continue", -1)),
              createBaseVNode("button", {
                onClick: _cache[0] || (_cache[0] = ($event) => showWalletConnect.value = true),
                class: "connect-btn"
              }, " Connect Wallet ")
            ]))
          ]),
          createBaseVNode("div", _hoisted_11$2, [
            createBaseVNode("div", {
              class: "menu-item",
              onClick: _cache[1] || (_cache[1] = ($event) => handleAction("browse-proposals")),
              title: "All proposals with advanced filters"
            }, [..._cache[13] || (_cache[13] = [
              createBaseVNode("span", { class: "icon" }, "📋", -1),
              createBaseVNode("span", null, "Browse Proposals", -1)
            ])]),
            createBaseVNode("div", {
              class: "menu-item",
              onClick: _cache[2] || (_cache[2] = ($event) => handleAction("unified-dashboard")),
              title: "My dashboard & team workflow"
            }, [..._cache[14] || (_cache[14] = [
              createBaseVNode("span", { class: "icon" }, "📊", -1),
              createBaseVNode("span", null, "Dashboard & Workflow", -1)
            ])]),
            createBaseVNode("div", {
              class: "menu-item",
              onClick: _cache[3] || (_cache[3] = ($event) => handleAction("settings-more")),
              title: "Configuration, history & help"
            }, [..._cache[15] || (_cache[15] = [
              createBaseVNode("span", { class: "icon" }, "⚙️", -1),
              createBaseVNode("span", null, "Settings & More", -1)
            ])])
          ]),
          showWalletConnect.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "modal-overlay",
            onClick: _cache[6] || (_cache[6] = ($event) => showWalletConnect.value = false)
          }, [
            createBaseVNode("div", {
              class: "modal-content",
              onClick: _cache[5] || (_cache[5] = withModifiers(() => {
              }, ["stop"]))
            }, [
              createVNode(WalletConnect, {
                onClose: _cache[4] || (_cache[4] = ($event) => showWalletConnect.value = false)
              })
            ])
          ])) : createCommentVNode("", true),
          createVNode(ProposalBrowser, {
            show: showProposalBrowser.value,
            onClose: _cache[7] || (_cache[7] = ($event) => showProposalBrowser.value = false)
          }, null, 8, ["show"]),
          createVNode(Dashboard, {
            show: showUnifiedDashboard.value,
            onClose: _cache[8] || (_cache[8] = ($event) => showUnifiedDashboard.value = false)
          }, null, 8, ["show"]),
          createVNode(SettingsMore, {
            show: showSettingsMore.value,
            onClose: _cache[9] || (_cache[9] = ($event) => showSettingsMore.value = false)
          }, null, 8, ["show"]),
          createVNode(DAOConfigModal, {
            show: showDAOConfig.value,
            onClose: _cache[10] || (_cache[10] = ($event) => showDAOConfig.value = false),
            onSaved: handleConfigSaved
          }, null, 8, ["show"])
        ]);
      };
    }
  });
  const Menu = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-e2e1959b"]]);
  const _hoisted_1$7 = {
    id: "voting-tool-app",
    class: "voting-tool-container"
  };
  const _hoisted_2$7 = { class: "button-icon" };
  const _hoisted_3$7 = {
    key: 0,
    class: "hamburger-icon"
  };
  const _hoisted_4$6 = { key: 1 };
  const _hoisted_5$6 = {
    key: 0,
    class: "dropdown-menu"
  };
  const _sfc_main$7 = /* @__PURE__ */ defineComponent({
    __name: "App",
    setup(__props) {
      const isMenuOpen = ref(false);
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$7, [
          createBaseVNode("div", {
            class: normalizeClass(["floating-button", { "menu-open": isMenuOpen.value }]),
            onClick: toggleMenu
          }, [
            createBaseVNode("div", _hoisted_2$7, [
              !isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_3$7, [..._cache[0] || (_cache[0] = [
                createBaseVNode("span", null, null, -1),
                createBaseVNode("span", null, null, -1),
                createBaseVNode("span", null, null, -1)
              ])])) : (openBlock(), createElementBlock("span", _hoisted_4$6, "✕"))
            ])
          ], 2),
          isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_5$6, [
            createVNode(Menu)
          ])) : createCommentVNode("", true)
        ]);
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-c1fca634"]]);
  const _hoisted_1$6 = { class: "modal-header" };
  const _hoisted_2$6 = { class: "modal-content" };
  const _hoisted_3$6 = { class: "status-options" };
  const _hoisted_4$5 = { class: "status-list" };
  const _hoisted_5$5 = ["onClick"];
  const _hoisted_6$4 = { class: "option-text" };
  const _hoisted_7$3 = {
    key: 0,
    class: "selected-indicator"
  };
  const _hoisted_8$2 = { class: "reason-section" };
  const _hoisted_9$2 = { class: "modal-actions" };
  const _hoisted_10$2 = ["disabled"];
  const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    __name: "StatusChangeModal",
    props: {
      show: { type: Boolean },
      proposalId: {},
      currentStatus: {}
    },
    emits: ["close", "save"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const selectedStatus = ref(props.currentStatus);
      const changeReason = ref("");
      const statusConfig = {
        "Not started": { color: "#6c757d", icon: "⚪" },
        "Considering": { color: "#ffc107", icon: "🤔" },
        "Ready for approval": { color: "#17a2b8", icon: "📋" },
        "Waiting for agreement": { color: "#fd7e14", icon: "⏳" },
        "Ready to vote": { color: "#28a745", icon: "🗳️" },
        "Reconsidering": { color: "#dc3545", icon: "🔄" },
        "Voted 👍 Aye 👍": { color: "#198754", icon: "👍" },
        "Voted 👎 Nay 👎": { color: "#dc3545", icon: "👎" },
        "Voted ✌️ Abstain ✌️": { color: "#6f42c1", icon: "✌️" },
        "Not Voted": { color: "#e9ecef", icon: "❌" }
      };
      const getAllowedTransitions = (currentStatus) => {
        const allowedTransitions = {
          "Not started": [],
          // Can't manually change from Not started
          "Considering": ["Ready for approval"],
          // Can only move to Ready for approval
          "Ready for approval": ["Waiting for agreement", "Considering"],
          // Can move back to Considering or forward to Waiting
          "Waiting for agreement": ["Ready for approval"],
          // Can move back to Ready for approval
          "Ready to vote": [],
          // Automatic based on agreements
          "Reconsidering": ["Ready for approval"],
          // Can move back to Ready for approval
          "Voted 👍 Aye 👍": [],
          // Final states - can't change
          "Voted 👎 Nay 👎": [],
          // Final states - can't change
          "Voted ✌️ Abstain ✌️": [],
          // Final states - can't change
          "Not Voted": []
          // Final state - can't change
        };
        return allowedTransitions[currentStatus] || [];
      };
      const statusOptions = getAllowedTransitions(props.currentStatus).map((status) => ({
        value: status,
        icon: statusConfig[status].icon,
        color: statusConfig[status].color
      }));
      const handleSave = () => {
        if (!selectedStatus.value || selectedStatus.value === props.currentStatus) return;
        const allowedTransitions = getAllowedTransitions(props.currentStatus);
        if (!allowedTransitions.includes(selectedStatus.value)) {
          alert("This status transition is not allowed");
          return;
        }
        emit2("save", {
          newStatus: selectedStatus.value,
          reason: changeReason.value
        });
      };
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
      };
      onMounted(() => {
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      watch(() => props.show, (newShow) => {
        if (newShow) {
          selectedStatus.value = props.currentStatus;
          changeReason.value = "";
        }
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "status-modal",
            onClick: _cache[3] || (_cache[3] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$6, [
              _cache[5] || (_cache[5] = createBaseVNode("h3", null, "Change Status", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$6, [
              createBaseVNode("p", null, [
                _cache[6] || (_cache[6] = createBaseVNode("strong", null, "Proposal:", -1)),
                createTextVNode(" #" + toDisplayString(_ctx.proposalId), 1)
              ]),
              createBaseVNode("p", null, [
                _cache[7] || (_cache[7] = createBaseVNode("strong", null, "Current Status:", -1)),
                createTextVNode(" " + toDisplayString(_ctx.currentStatus), 1)
              ]),
              createBaseVNode("div", _hoisted_3$6, [
                _cache[8] || (_cache[8] = createBaseVNode("label", null, "New Status:", -1)),
                createBaseVNode("div", _hoisted_4$5, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(statusOptions), (statusOption) => {
                    return openBlock(), createElementBlock("button", {
                      key: statusOption.value,
                      class: normalizeClass(["status-option", { selected: selectedStatus.value === statusOption.value }]),
                      onClick: ($event) => selectedStatus.value = statusOption.value
                    }, [
                      createBaseVNode("span", _hoisted_6$4, toDisplayString(statusOption.value), 1),
                      selectedStatus.value === statusOption.value ? (openBlock(), createElementBlock("span", _hoisted_7$3, "✓")) : createCommentVNode("", true)
                    ], 10, _hoisted_5$5);
                  }), 128))
                ])
              ]),
              createBaseVNode("div", _hoisted_8$2, [
                _cache[9] || (_cache[9] = createBaseVNode("label", { for: "reason" }, "Reason for change (optional):", -1)),
                withDirectives(createBaseVNode("textarea", {
                  id: "reason",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => changeReason.value = $event),
                  placeholder: "Explain why you're changing the status...",
                  rows: "3"
                }, null, 512), [
                  [vModelText, changeReason.value]
                ])
              ]),
              createBaseVNode("div", _hoisted_9$2, [
                createBaseVNode("button", {
                  class: "btn btn-secondary",
                  onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("close"))
                }, "Cancel"),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: handleSave,
                  disabled: !selectedStatus.value || selectedStatus.value === _ctx.currentStatus
                }, " Update Status ", 8, _hoisted_10$2)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const StatusChangeModal = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-a01f811b"]]);
  const _hoisted_1$5 = { class: "modal-header" };
  const _hoisted_2$5 = { class: "modal-content" };
  const _hoisted_3$5 = {
    key: 0,
    class: "error-message"
  };
  const _hoisted_4$4 = { class: "modal-actions" };
  const _hoisted_5$4 = ["disabled"];
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    __name: "AssignModal",
    props: {
      show: { type: Boolean },
      proposalId: {},
      chain: {}
    },
    emits: ["close", "confirm"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const loading = ref(false);
      const error = ref("");
      const handleAssign = async () => {
        var _a, _b;
        loading.value = true;
        error.value = "";
        try {
          if (!authStore.state.isAuthenticated || !((_a = authStore.state.user) == null ? void 0 : _a.address)) {
            throw new Error("Please connect your wallet first");
          }
          const proposal = proposalStore.state.proposals.find((p2) => p2.post_id === props.proposalId);
          if (!proposal) {
            throw new Error("Proposal not found");
          }
          if (proposal.assigned_to && proposal.assigned_to !== ((_b = authStore.state.user) == null ? void 0 : _b.address)) {
            throw new Error("This proposal is already assigned to another team member");
          }
          const apiService = ApiService.getInstance();
          console.log("Props: ", props);
          await apiService.assignProposal(props.proposalId, props.chain);
          await proposalStore.updateProposal(props.proposalId, props.chain, {
            assigned_to: authStore.state.user.address,
            internal_status: "Considering"
          });
          await proposalStore.fetchProposals();
          emit2("confirm");
          emit2("close");
        } catch (err) {
          console.error("Failed to assign proposal:", err);
          error.value = err instanceof Error ? err.message : "Failed to assign proposal";
        } finally {
          loading.value = false;
        }
      };
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
      };
      onMounted(() => {
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "assign-modal",
            onClick: _cache[2] || (_cache[2] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$5, [
              _cache[4] || (_cache[4] = createBaseVNode("h3", null, "Assign Proposal", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$5, [
              createBaseVNode("p", null, [
                _cache[5] || (_cache[5] = createBaseVNode("strong", null, "Proposal:", -1)),
                createTextVNode(" #" + toDisplayString(_ctx.proposalId), 1)
              ]),
              _cache[6] || (_cache[6] = createBaseVNode("p", null, "This will assign the proposal to you for review and voting.", -1)),
              error.value ? (openBlock(), createElementBlock("div", _hoisted_3$5, toDisplayString(error.value), 1)) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_4$4, [
                createBaseVNode("button", {
                  class: "btn btn-secondary",
                  onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
                }, "Cancel"),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: handleAssign,
                  disabled: loading.value
                }, toDisplayString(loading.value ? "Assigning..." : "Assign to Me"), 9, _hoisted_5$4)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const AssignModal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-5f7a28c8"]]);
  const _hoisted_1$4 = { class: "modal-header" };
  const _hoisted_2$4 = { class: "modal-content" };
  const _hoisted_3$4 = { class: "form-group" };
  const _hoisted_4$3 = {
    key: 0,
    class: "current-values"
  };
  const _hoisted_5$3 = {
    key: 1,
    class: "error-message"
  };
  const _hoisted_6$3 = { class: "modal-actions" };
  const _hoisted_7$2 = ["disabled"];
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "UnassignModal",
    props: {
      show: { type: Boolean },
      proposalId: {}
    },
    emits: ["close", "confirm"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const loading = ref(false);
      const error = ref("");
      const note = ref("");
      const currentValues = ref(null);
      onMounted(async () => {
        try {
          const proposal = proposalStore.state.proposals.find(
            (p2) => p2.post_id === props.proposalId
          );
          if (proposal) {
            currentValues.value = {
              internalStatus: proposal.internal_status,
              suggestedVote: proposal.suggested_vote || null
            };
          }
        } catch (err) {
          console.error("Failed to load current values:", err);
        }
      });
      const handleUnassign = async () => {
        loading.value = true;
        error.value = "";
        try {
          emit2("confirm", note.value.trim() || void 0);
          emit2("close");
        } catch (err) {
          error.value = err instanceof Error ? err.message : "Failed to unassign proposal";
        } finally {
          loading.value = false;
        }
      };
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
      };
      onMounted(() => {
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "unassign-modal",
            onClick: _cache[3] || (_cache[3] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$4, [
              _cache[5] || (_cache[5] = createBaseVNode("h3", null, "Unassign Proposal", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$4, [
              createBaseVNode("p", null, [
                _cache[6] || (_cache[6] = createBaseVNode("strong", null, "Proposal:", -1)),
                createTextVNode(" #" + toDisplayString(_ctx.proposalId), 1)
              ]),
              _cache[9] || (_cache[9] = createBaseVNode("p", null, "This will remove your assignment from this proposal and reset its status.", -1)),
              createBaseVNode("div", _hoisted_3$4, [
                _cache[7] || (_cache[7] = createBaseVNode("label", { for: "unassignNote" }, "Unassign Note (optional):", -1)),
                withDirectives(createBaseVNode("textarea", {
                  id: "unassignNote",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => note.value = $event),
                  placeholder: "Add a note explaining why you're unassigning...",
                  rows: "3",
                  class: "form-control"
                }, null, 512), [
                  [vModelText, note.value]
                ])
              ]),
              currentValues.value ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
                _cache[8] || (_cache[8] = createBaseVNode("p", null, [
                  createBaseVNode("strong", null, "Current Values to be Reset:")
                ], -1)),
                createBaseVNode("ul", null, [
                  createBaseVNode("li", null, "Internal Status: " + toDisplayString(currentValues.value.internalStatus), 1),
                  createBaseVNode("li", null, "Suggested Vote: " + toDisplayString(currentValues.value.suggestedVote || "None"), 1)
                ])
              ])) : createCommentVNode("", true),
              error.value ? (openBlock(), createElementBlock("div", _hoisted_5$3, toDisplayString(error.value), 1)) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_6$3, [
                createBaseVNode("button", {
                  class: "btn btn-secondary",
                  onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("close"))
                }, "Cancel"),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: handleUnassign,
                  disabled: loading.value
                }, toDisplayString(loading.value ? "Unassigning..." : "Confirm Unassign"), 9, _hoisted_7$2)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const UnassignModal = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-281fbad4"]]);
  const _hoisted_1$3 = { class: "modal-header" };
  const _hoisted_2$3 = { class: "modal-content" };
  const _hoisted_3$3 = { class: "vote-options" };
  const _hoisted_4$2 = { class: "reason-section" };
  const _hoisted_5$2 = { class: "modal-actions" };
  const _hoisted_6$2 = ["disabled"];
  const _sfc_main$3 = /* @__PURE__ */ defineComponent({
    __name: "VoteChangeModal",
    props: {
      show: { type: Boolean },
      proposalId: {},
      currentVote: {},
      currentReason: {}
    },
    emits: ["close", "save"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const selectedVote = ref(null);
      const voteReason = ref("");
      const handleSave = () => {
        if (!selectedVote.value) return;
        emit2("save", {
          vote: selectedVote.value,
          reason: voteReason.value
        });
      };
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
      };
      onMounted(() => {
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      watch(() => props.show, (newShow) => {
        if (newShow) {
          selectedVote.value = props.currentVote || null;
          voteReason.value = props.currentReason || "";
        }
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "vote-modal",
            onClick: _cache[6] || (_cache[6] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$3, [
              _cache[8] || (_cache[8] = createBaseVNode("h3", null, "Change Suggested Vote", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$3, [
              createBaseVNode("p", null, [
                _cache[9] || (_cache[9] = createBaseVNode("strong", null, "Proposal:", -1)),
                createTextVNode(" #" + toDisplayString(_ctx.proposalId), 1)
              ]),
              _cache[14] || (_cache[14] = createBaseVNode("p", null, "Select your suggested vote for this proposal:", -1)),
              createBaseVNode("div", _hoisted_3$3, [
                createBaseVNode("button", {
                  class: normalizeClass(["vote-option aye", { selected: selectedVote.value === "👍 Aye 👍" }]),
                  onClick: _cache[1] || (_cache[1] = ($event) => selectedVote.value = "👍 Aye 👍")
                }, [..._cache[10] || (_cache[10] = [
                  createBaseVNode("span", { class: "vote-text" }, "Aye", -1)
                ])], 2),
                createBaseVNode("button", {
                  class: normalizeClass(["vote-option nay", { selected: selectedVote.value === "👎 Nay 👎" }]),
                  onClick: _cache[2] || (_cache[2] = ($event) => selectedVote.value = "👎 Nay 👎")
                }, [..._cache[11] || (_cache[11] = [
                  createBaseVNode("span", { class: "vote-text" }, "Nay", -1)
                ])], 2),
                createBaseVNode("button", {
                  class: normalizeClass(["vote-option abstain", { selected: selectedVote.value === "✌️ Abstain ✌️" }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => selectedVote.value = "✌️ Abstain ✌️")
                }, [..._cache[12] || (_cache[12] = [
                  createBaseVNode("span", { class: "vote-text" }, "Abstain", -1)
                ])], 2)
              ]),
              createBaseVNode("div", _hoisted_4$2, [
                _cache[13] || (_cache[13] = createBaseVNode("label", { for: "vote-reason" }, "Reason (optional):", -1)),
                withDirectives(createBaseVNode("textarea", {
                  id: "vote-reason",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => voteReason.value = $event),
                  placeholder: "Explain your vote suggestion...",
                  rows: "3"
                }, null, 512), [
                  [vModelText, voteReason.value]
                ])
              ]),
              createBaseVNode("div", _hoisted_5$2, [
                createBaseVNode("button", {
                  class: "btn btn-secondary",
                  onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("close"))
                }, "Cancel"),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: handleSave,
                  disabled: !selectedVote.value
                }, " Update Vote ", 8, _hoisted_6$2)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const VoteChangeModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-eeb2c9ac"]]);
  const _hoisted_1$2 = { class: "modal-header" };
  const _hoisted_2$2 = { class: "modal-body" };
  const _hoisted_3$2 = { class: "modal-actions" };
  const _sfc_main$2 = /* @__PURE__ */ defineComponent({
    __name: "ConfirmModal",
    props: {
      show: { type: Boolean },
      title: {},
      message: {},
      confirmText: { default: "Confirm" },
      cancelText: { default: "Cancel" },
      type: { default: "default" }
    },
    emits: ["confirm", "cancel"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const confirmButtonClass = computed(() => {
        switch (props.type) {
          case "danger":
            return "danger";
          case "warning":
            return "warning";
          default:
            return "primary";
        }
      });
      const handleConfirm = () => {
        emit2("confirm");
      };
      const handleCancel = () => {
        emit2("cancel");
      };
      const handleOverlayClick = () => {
        emit2("cancel");
      };
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: handleOverlayClick
        }, [
          createBaseVNode("div", {
            class: "modal-content",
            onClick: _cache[0] || (_cache[0] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$2, [
              createBaseVNode("h3", null, toDisplayString(_ctx.title), 1)
            ]),
            createBaseVNode("div", _hoisted_2$2, [
              createBaseVNode("p", null, toDisplayString(_ctx.message), 1)
            ]),
            createBaseVNode("div", _hoisted_3$2, [
              createBaseVNode("button", {
                onClick: handleCancel,
                class: "cancel-btn"
              }, toDisplayString(_ctx.cancelText), 1),
              createBaseVNode("button", {
                onClick: handleConfirm,
                class: normalizeClass(["confirm-btn", confirmButtonClass.value])
              }, toDisplayString(_ctx.confirmText), 3)
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const ConfirmModal = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-e479232c"]]);
  const _hoisted_1$1 = { class: "team-actions-panel" };
  const _hoisted_2$1 = { class: "panel-header" };
  const _hoisted_3$1 = {
    key: 0,
    class: "loading-state"
  };
  const _hoisted_4$1 = {
    key: 1,
    class: "panel-content"
  };
  const _hoisted_5$1 = { class: "agreement-section" };
  const _hoisted_6$1 = { class: "agreement-bar" };
  const _hoisted_7$1 = { class: "progress-bar" };
  const _hoisted_8$1 = { class: "agreement-text" };
  const _hoisted_9$1 = {
    key: 0,
    class: "veto-text"
  };
  const _hoisted_10$1 = { key: 1 };
  const _hoisted_11$1 = {
    key: 0,
    class: "veto-reason"
  };
  const _hoisted_12$1 = { class: "team-status-section" };
  const _hoisted_13 = { class: "team-members" };
  const _hoisted_14 = { class: "member-info" };
  const _hoisted_15 = { class: "member-avatar" };
  const _hoisted_16 = { class: "member-details" };
  const _hoisted_17 = { class: "member-name" };
  const _hoisted_18 = { class: "member-address" };
  const _hoisted_19 = { class: "member-action" };
  const _hoisted_20 = { class: "user-actions-section" };
  const _hoisted_21 = { class: "action-buttons" };
  const _hoisted_22 = ["title"];
  const _hoisted_23 = ["title"];
  const _hoisted_24 = ["title"];
  const _hoisted_25 = ["title"];
  const _hoisted_26 = {
    key: 0,
    class: "veto-reason-section"
  };
  const _hoisted_27 = { class: "veto-reason-content" };
  const _hoisted_28 = { class: "veto-by" };
  const _hoisted_29 = { class: "veto-reason-text" };
  const _hoisted_30 = { class: "discussion-section" };
  const _hoisted_31 = { class: "comments-list" };
  const _hoisted_32 = { class: "comment-header" };
  const _hoisted_33 = { class: "comment-author" };
  const _hoisted_34 = { class: "author-avatar" };
  const _hoisted_35 = { class: "author-info" };
  const _hoisted_36 = { class: "author-name" };
  const _hoisted_37 = { class: "comment-time" };
  const _hoisted_38 = ["onClick"];
  const _hoisted_39 = { class: "comment-content" };
  const _hoisted_40 = {
    key: 0,
    class: "no-comments"
  };
  const _hoisted_41 = { class: "add-comment" };
  const _hoisted_42 = { class: "comment-input-wrapper" };
  const _hoisted_43 = ["placeholder", "readonly"];
  const _hoisted_44 = { class: "comment-actions" };
  const _hoisted_45 = { class: "comment-hint" };
  const _hoisted_46 = {
    key: 0,
    class: "hint-text"
  };
  const _hoisted_47 = {
    key: 1,
    class: "hint-text"
  };
  const _hoisted_48 = ["disabled", "title"];
  const _hoisted_49 = { class: "modal-actions" };
  const _hoisted_50 = ["disabled"];
  const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    __name: "TeamActionsPanel",
    props: {
      proposalId: {},
      chain: {}
    },
    emits: ["close", "updated"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const loading = ref(true);
      const apiService = ApiService.getInstance();
      const agreementSummary = ref(null);
      const comments = ref([]);
      const currentUserAction = ref(null);
      const newComment = ref("");
      const showVetoModal = ref(false);
      const vetoReason = ref("");
      const showConfirmModal = ref(false);
      const showAlertModal = ref(false);
      const confirmModalData = ref({
        title: "",
        message: "",
        type: "default",
        onConfirm: () => {
        }
      });
      const alertModalData = ref({
        title: "",
        message: "",
        type: "info"
      });
      const currentUserAddress = computed(() => {
        var _a;
        return (_a = authStore.state.user) == null ? void 0 : _a.address;
      });
      computed(() => {
        var _a;
        return ((_a = authStore.state.user) == null ? void 0 : _a.name) || "Unknown User";
      });
      computed(() => {
        return authStore.state.isAuthenticated;
      });
      computed(() => {
        return authStore.state.isAuthenticated;
      });
      const showConfirm = (title, message, onConfirm, type = "default") => {
        confirmModalData.value = { title, message, type, onConfirm };
        showConfirmModal.value = true;
      };
      const showAlert = (title, message, type = "info") => {
        alertModalData.value = { title, message, type };
        showAlertModal.value = true;
      };
      const showLoginPrompt = (message) => {
        showConfirm(
          "Connect Wallet",
          `${message}

Would you like to connect your wallet now?`,
          () => {
            window.dispatchEvent(new CustomEvent("requestWalletConnection"));
          },
          "default"
        );
      };
      const agreementPercentage = computed(() => {
        if (!agreementSummary.value) return 0;
        if (agreementSummary.value.vetoed) return 100;
        return Math.min(100, agreementSummary.value.total_agreements / agreementSummary.value.required_agreements * 100);
      });
      const allTeamMembers = computed(() => {
        if (!agreementSummary.value) return [];
        const all = [
          ...agreementSummary.value.agreed_members,
          ...agreementSummary.value.pending_members,
          ...agreementSummary.value.recused_members,
          ...agreementSummary.value.to_be_discussed_members
        ];
        const unique = all.filter(
          (member, index, self2) => index === self2.findIndex((m) => m.address === member.address)
        );
        return unique;
      });
      const loadData = async () => {
        loading.value = true;
        try {
          await Promise.all([
            loadAgreementSummary(),
            loadComments(),
            loadCurrentUserAction()
          ]);
        } catch (error) {
          console.error("Failed to load team data:", error);
        } finally {
          loading.value = false;
        }
      };
      const loadAgreementSummary = async () => {
        var _a;
        const summary = await apiService.getAgreementSummary(props.proposalId, props.chain);
        agreementSummary.value = summary;
        if (summary && ((_a = authStore.state.user) == null ? void 0 : _a.address)) {
          const userAddress = authStore.state.user.address;
          if (summary.agreed_members.some((m) => m.address === userAddress)) {
            currentUserAction.value = "Agree";
          } else if (summary.recused_members.some((m) => m.address === userAddress)) {
            currentUserAction.value = "Recuse";
          } else if (summary.to_be_discussed_members.some((m) => m.address === userAddress)) {
            currentUserAction.value = "To be discussed";
          } else if (summary.vetoed && summary.veto_by === authStore.state.user.name) {
            currentUserAction.value = "NO WAY";
          } else {
            currentUserAction.value = null;
          }
        }
      };
      const loadComments = async () => {
        const fetchedComments = await apiService.getComments(props.proposalId, props.chain);
        comments.value = fetchedComments;
      };
      const loadCurrentUserAction = async () => {
        const actions = await apiService.getTeamActions(props.proposalId, props.chain);
        const userAction = actions.find((action) => action.wallet_address === currentUserAddress.value);
        if (userAction == null ? void 0 : userAction.role_type) {
          const roleTypeMapping = {
            "agree": "Agree",
            "to_be_discussed": "To be discussed",
            "no_way": "NO WAY",
            "recuse": "Recuse"
          };
          currentUserAction.value = roleTypeMapping[userAction.role_type] || null;
        } else {
          currentUserAction.value = null;
        }
      };
      const submitAction = async (action) => {
        if (!authStore.state.isAuthenticated) {
          showLoginPrompt("Please connect your wallet to take team actions.");
          return;
        }
        try {
          const result = await apiService.submitTeamAction(props.proposalId, props.chain, action);
          if (result.success) {
            currentUserAction.value = action;
            await loadAgreementSummary();
            window.dispatchEvent(new CustomEvent("teamActionChanged", {
              detail: {
                proposalId: props.proposalId,
                chain: props.chain,
                action
              }
            }));
          } else {
            showAlert("Action Failed", `Failed to submit action: ${result.error}`, "error");
          }
        } catch (error) {
          console.error("Failed to submit action:", error);
          showAlert("Action Failed", "Failed to submit action. Please try again.", "error");
        }
      };
      const submitVeto = async () => {
        if (!vetoReason.value.trim()) return;
        try {
          const result = await apiService.submitTeamAction(props.proposalId, props.chain, "NO WAY", vetoReason.value);
          if (result.success) {
            currentUserAction.value = "NO WAY";
            showVetoModal.value = false;
            vetoReason.value = "";
            await loadAgreementSummary();
            window.dispatchEvent(new CustomEvent("teamActionChanged", {
              detail: {
                proposalId: props.proposalId,
                chain: props.chain,
                action: "NO WAY"
              }
            }));
          } else {
            showAlert("Veto Failed", `Failed to veto proposal: ${result.error}`, "error");
          }
        } catch (error) {
          console.error("Failed to veto proposal:", error);
          showAlert("Veto Failed", "Failed to veto proposal. Please try again.", "error");
        }
      };
      const addComment = async () => {
        if (!newComment.value.trim()) return;
        if (!authStore.state.isAuthenticated) {
          showLoginPrompt("Please connect your wallet to add comments.");
          return;
        }
        try {
          const result = await apiService.addComment(props.proposalId, props.chain, newComment.value);
          if (result.success) {
            newComment.value = "";
            await loadComments();
          } else {
            showAlert("Comment Failed", `Failed to add comment: ${result.error}`, "error");
          }
        } catch (error) {
          console.error("Failed to add comment:", error);
          showAlert("Comment Failed", "Failed to add comment. Please try again.", "error");
        }
      };
      const deleteComment = async (commentId) => {
        showConfirm(
          "Delete Comment",
          "Are you sure you want to delete this comment?",
          async () => {
            try {
              const result = await apiService.deleteComment(commentId);
              if (result.success) {
                await loadComments();
                showAlert("Success", "Comment deleted successfully", "success");
              } else {
                showAlert("Delete Failed", `Failed to delete comment: ${result.error}`, "error");
              }
            } catch (error) {
              console.error("Failed to delete comment:", error);
              showAlert("Delete Failed", "Failed to delete comment. Please try again.", "error");
            }
          },
          "danger"
        );
      };
      const getMemberStatusClass = (member) => {
        if (!agreementSummary.value) return "";
        if (agreementSummary.value.agreed_members.some((m) => m.address === member.address)) {
          return "agreed";
        } else if (agreementSummary.value.recused_members.some((m) => m.address === member.address)) {
          return "recused";
        } else if (agreementSummary.value.to_be_discussed_members.some((m) => m.address === member.address)) {
          return "discuss";
        }
        return "pending";
      };
      const getMemberActionClass = (member) => {
        const status = getMemberStatusClass(member);
        return `action-${status}`;
      };
      const getMemberActionText = (member) => {
        const statusClass = getMemberStatusClass(member);
        switch (statusClass) {
          case "agreed":
            return "Agreed";
          case "recused":
            return "Recused";
          case "discuss":
            return "To discuss";
          default:
            return "Pending";
        }
      };
      const getInitials = (name) => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      };
      const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
      };
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
      };
      onMounted(() => {
        loadData();
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      watch(() => authStore.state.isAuthenticated, (isAuth) => {
        if (isAuth) {
          loadData();
        }
      });
      return (_ctx, _cache) => {
        var _a, _b, _c, _d, _e, _f, _g;
        return openBlock(), createElementBlock("div", _hoisted_1$1, [
          createBaseVNode("div", _hoisted_2$1, [
            _cache[14] || (_cache[14] = createBaseVNode("h3", null, "Team Collaboration", -1)),
            createBaseVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close")),
              class: "close-btn"
            }, "✕")
          ]),
          loading.value ? (openBlock(), createElementBlock("div", _hoisted_3$1, [..._cache[15] || (_cache[15] = [
            createBaseVNode("div", { class: "spinner" }, null, -1),
            createBaseVNode("p", null, "Loading team data...", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_4$1, [
            createBaseVNode("div", _hoisted_5$1, [
              _cache[17] || (_cache[17] = createBaseVNode("h4", null, "Agreement Status", -1)),
              createBaseVNode("div", _hoisted_6$1, [
                createBaseVNode("div", _hoisted_7$1, [
                  createBaseVNode("div", {
                    class: normalizeClass(["progress-fill", { "vetoed": (_a = agreementSummary.value) == null ? void 0 : _a.vetoed }]),
                    style: normalizeStyle({ width: `${agreementPercentage.value}%` })
                  }, null, 6)
                ]),
                createBaseVNode("div", _hoisted_8$1, [
                  ((_b = agreementSummary.value) == null ? void 0 : _b.vetoed) ? (openBlock(), createElementBlock("span", _hoisted_9$1, " 🚫 NO WAYED by " + toDisplayString(agreementSummary.value.veto_by), 1)) : (openBlock(), createElementBlock("span", _hoisted_10$1, toDisplayString(((_c = agreementSummary.value) == null ? void 0 : _c.total_agreements) || 0) + " / " + toDisplayString(((_d = agreementSummary.value) == null ? void 0 : _d.required_agreements) || 4) + " agreements ", 1))
                ])
              ]),
              ((_e = agreementSummary.value) == null ? void 0 : _e.vetoed) && agreementSummary.value.veto_reason ? (openBlock(), createElementBlock("div", _hoisted_11$1, [
                _cache[16] || (_cache[16] = createBaseVNode("strong", null, "Veto Reason:", -1)),
                createTextVNode(" " + toDisplayString(agreementSummary.value.veto_reason), 1)
              ])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_12$1, [
              _cache[18] || (_cache[18] = createBaseVNode("h4", null, "Team Status", -1)),
              createBaseVNode("div", _hoisted_13, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(allTeamMembers.value, (member) => {
                  return openBlock(), createElementBlock("div", {
                    key: member.address,
                    class: normalizeClass(["member-status", getMemberStatusClass(member)])
                  }, [
                    createBaseVNode("div", _hoisted_14, [
                      createBaseVNode("div", _hoisted_15, toDisplayString(getInitials(member.name)), 1),
                      createBaseVNode("div", _hoisted_16, [
                        createBaseVNode("div", _hoisted_17, toDisplayString(member.name), 1),
                        createBaseVNode("div", _hoisted_18, toDisplayString(unref(formatAddress)(member.address, { forceShorten: false })), 1)
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_19, [
                      createBaseVNode("span", {
                        class: normalizeClass(["action-badge", getMemberActionClass(member)])
                      }, toDisplayString(getMemberActionText(member)), 3)
                    ])
                  ], 2);
                }), 128))
              ])
            ]),
            createBaseVNode("div", _hoisted_20, [
              _cache[19] || (_cache[19] = createBaseVNode("h4", null, "Your Action", -1)),
              createBaseVNode("div", _hoisted_21, [
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => submitAction("Agree")),
                  class: normalizeClass(["action-btn agree-btn", { active: currentUserAction.value === "Agree" }]),
                  title: !unref(authStore).state.isAuthenticated ? "Connect wallet to agree" : "Agree with this proposal"
                }, toDisplayString(unref(authStore).state.isAuthenticated ? "Agree" : "Connect to Agree"), 11, _hoisted_22),
                createBaseVNode("button", {
                  onClick: _cache[2] || (_cache[2] = ($event) => submitAction("To be discussed")),
                  class: normalizeClass(["action-btn discuss-btn", { active: currentUserAction.value === "To be discussed" }]),
                  title: !unref(authStore).state.isAuthenticated ? "Connect wallet to mark for discussion" : "Mark for team discussion"
                }, toDisplayString(unref(authStore).state.isAuthenticated ? "To be discussed" : "Connect to Discuss"), 11, _hoisted_23),
                createBaseVNode("button", {
                  onClick: _cache[3] || (_cache[3] = ($event) => showVetoModal.value = true),
                  class: normalizeClass(["action-btn veto-btn", { active: currentUserAction.value === "NO WAY" }]),
                  title: !unref(authStore).state.isAuthenticated ? "Connect wallet to veto" : "Veto this proposal"
                }, toDisplayString(unref(authStore).state.isAuthenticated ? "NO WAY" : "Connect to Veto"), 11, _hoisted_24),
                createBaseVNode("button", {
                  onClick: _cache[4] || (_cache[4] = ($event) => submitAction("Recuse")),
                  class: normalizeClass(["action-btn recuse-btn", { active: currentUserAction.value === "Recuse" }]),
                  title: !unref(authStore).state.isAuthenticated ? "Connect wallet to recuse" : "Recuse from this proposal"
                }, toDisplayString(unref(authStore).state.isAuthenticated ? "Recuse" : "Connect to Recuse"), 11, _hoisted_25)
              ])
            ]),
            ((_f = agreementSummary.value) == null ? void 0 : _f.vetoed) && ((_g = agreementSummary.value) == null ? void 0 : _g.veto_reason) ? (openBlock(), createElementBlock("div", _hoisted_26, [
              _cache[22] || (_cache[22] = createBaseVNode("h4", null, "🚫 NO WAY Reason", -1)),
              createBaseVNode("div", _hoisted_27, [
                createBaseVNode("div", _hoisted_28, [
                  _cache[20] || (_cache[20] = createBaseVNode("strong", null, "Vetoed by:", -1)),
                  createTextVNode(" " + toDisplayString(agreementSummary.value.veto_by || "Unknown Member"), 1)
                ]),
                createBaseVNode("div", _hoisted_29, [
                  _cache[21] || (_cache[21] = createBaseVNode("strong", null, "Reason:", -1)),
                  createTextVNode(" " + toDisplayString(agreementSummary.value.veto_reason), 1)
                ])
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_30, [
              _cache[24] || (_cache[24] = createBaseVNode("h4", null, "💬 Internal Team Discussion", -1)),
              createBaseVNode("div", _hoisted_31, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(comments.value, (comment) => {
                  return openBlock(), createElementBlock("div", {
                    key: comment.id,
                    class: "comment"
                  }, [
                    createBaseVNode("div", _hoisted_32, [
                      createBaseVNode("div", _hoisted_33, [
                        createBaseVNode("div", _hoisted_34, toDisplayString(getInitials(comment.user_name)), 1),
                        createBaseVNode("div", _hoisted_35, [
                          createBaseVNode("div", _hoisted_36, toDisplayString(comment.user_name), 1),
                          createBaseVNode("div", _hoisted_37, toDisplayString(formatTime(comment.created_at)), 1)
                        ])
                      ]),
                      comment.user_address === currentUserAddress.value ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        onClick: ($event) => deleteComment(comment.id),
                        class: "delete-comment-btn",
                        title: "Delete comment"
                      }, " ✕ ", 8, _hoisted_38)) : createCommentVNode("", true)
                    ]),
                    createBaseVNode("div", _hoisted_39, toDisplayString(comment.content), 1)
                  ]);
                }), 128)),
                comments.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_40, [..._cache[23] || (_cache[23] = [
                  createBaseVNode("div", { class: "empty-state" }, [
                    createBaseVNode("div", { class: "empty-icon" }, "💭"),
                    createBaseVNode("div", { class: "empty-text" }, "No team discussions yet"),
                    createBaseVNode("div", { class: "empty-subtext" }, "Start the conversation about this proposal")
                  ], -1)
                ])])) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_41, [
                createBaseVNode("div", _hoisted_42, [
                  withDirectives(createBaseVNode("textarea", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => newComment.value = $event),
                    placeholder: unref(authStore).state.isAuthenticated ? "Share your thoughts with the team..." : "Connect wallet to comment",
                    class: "comment-input",
                    readonly: !unref(authStore).state.isAuthenticated,
                    rows: "3",
                    onFocus: _cache[6] || (_cache[6] = ($event) => !unref(authStore).state.isAuthenticated && showLoginPrompt("Please connect your wallet to add comments."))
                  }, null, 40, _hoisted_43), [
                    [vModelText, newComment.value]
                  ]),
                  createBaseVNode("div", _hoisted_44, [
                    createBaseVNode("div", _hoisted_45, [
                      !unref(authStore).state.isAuthenticated ? (openBlock(), createElementBlock("span", _hoisted_46, "Connect wallet to comment")) : (openBlock(), createElementBlock("span", _hoisted_47, toDisplayString(newComment.value.length) + "/500 characters", 1))
                    ]),
                    createBaseVNode("button", {
                      onClick: addComment,
                      class: "add-comment-btn",
                      disabled: !newComment.value.trim() || newComment.value.length > 500,
                      title: !unref(authStore).state.isAuthenticated ? "Connect wallet to send comments" : "Send comment"
                    }, [
                      createBaseVNode("span", null, toDisplayString(unref(authStore).state.isAuthenticated ? "Send" : "Connect to Send"), 1)
                    ], 8, _hoisted_48)
                  ])
                ])
              ])
            ])
          ])),
          showVetoModal.value ? (openBlock(), createElementBlock("div", {
            key: 2,
            class: "modal-overlay",
            onClick: _cache[10] || (_cache[10] = ($event) => showVetoModal.value = false)
          }, [
            createBaseVNode("div", {
              class: "modal-content",
              onClick: _cache[9] || (_cache[9] = withModifiers(() => {
              }, ["stop"]))
            }, [
              _cache[25] || (_cache[25] = createBaseVNode("h3", null, "Veto This Proposal", -1)),
              _cache[26] || (_cache[26] = createBaseVNode("p", null, "You are about to veto this proposal. Please provide a reason:", -1)),
              withDirectives(createBaseVNode("textarea", {
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vetoReason.value = $event),
                placeholder: "Explain why you're vetoing this proposal...",
                class: "veto-reason-input",
                required: ""
              }, null, 512), [
                [vModelText, vetoReason.value]
              ]),
              createBaseVNode("div", _hoisted_49, [
                createBaseVNode("button", {
                  onClick: _cache[8] || (_cache[8] = ($event) => showVetoModal.value = false),
                  class: "cancel-btn"
                }, "Cancel"),
                createBaseVNode("button", {
                  onClick: submitVeto,
                  class: "veto-confirm-btn",
                  disabled: !vetoReason.value.trim()
                }, " Veto Proposal ", 8, _hoisted_50)
              ])
            ])
          ])) : createCommentVNode("", true),
          createVNode(ConfirmModal, {
            show: showConfirmModal.value,
            title: confirmModalData.value.title,
            message: confirmModalData.value.message,
            type: confirmModalData.value.type,
            onConfirm: _cache[11] || (_cache[11] = ($event) => {
              confirmModalData.value.onConfirm();
              showConfirmModal.value = false;
            }),
            onCancel: _cache[12] || (_cache[12] = ($event) => showConfirmModal.value = false)
          }, null, 8, ["show", "title", "message", "type"]),
          createVNode(AlertModal, {
            show: showAlertModal.value,
            title: alertModalData.value.title,
            message: alertModalData.value.message,
            type: alertModalData.value.type,
            onOk: _cache[13] || (_cache[13] = ($event) => showAlertModal.value = false)
          }, null, 8, ["show", "title", "message", "type"])
        ]);
      };
    }
  });
  const TeamActionsPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b45f2dbf"]]);
  const _hoisted_1 = {
    class: "voting-tool-controls",
    id: "voting-tool-controls"
  };
  const _hoisted_2 = { class: "controls-header" };
  const _hoisted_3 = { class: "status-badge-wrapper" };
  const _hoisted_4 = ["title"];
  const _hoisted_5 = { class: "status-icon" };
  const _hoisted_6 = { class: "status-text" };
  const _hoisted_7 = { class: "controls-actions" };
  const _hoisted_8 = ["title"];
  const _hoisted_9 = { class: "btn-text" };
  const _hoisted_10 = ["disabled", "title"];
  const _hoisted_11 = { class: "btn-text" };
  const _hoisted_12 = ["disabled", "title"];
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "VotingControls",
    props: {
      status: {},
      proposalId: {},
      editable: { type: Boolean },
      isAuthenticated: { type: Boolean },
      suggestedVote: {},
      reasonForVote: {},
      assignedTo: {},
      teamMembers: {},
      chain: {}
    },
    emits: ["update:status", "update:suggestedVote", "update:assignedTo", "proposal-updated"],
    setup(__props, { emit: __emit }) {
      const apiService = ApiService.getInstance();
      const props = __props;
      const showStatusModal = ref(false);
      const showAssignModal = ref(false);
      const showUnassignModal = ref(false);
      const showVoteModal = ref(false);
      const showTeamPanel = ref(false);
      const showConfirmModal = ref(false);
      const confirmModalData = ref({
        title: "",
        message: "",
        onConfirm: () => {
        }
      });
      const normalizeAddress = (address) => {
        if (!address) return "";
        return address.trim().toLowerCase();
      };
      const addressesMatch = (addr1, addr2) => {
        if (!addr1 || !addr2) {
          return false;
        }
        if (normalizeAddress(addr1) === normalizeAddress(addr2)) {
          return true;
        }
        if (props.teamMembers && props.teamMembers.length > 0) {
          const member1 = props.teamMembers.find((m) => normalizeAddress(m.address) === normalizeAddress(addr1));
          const member2 = props.teamMembers.find((m) => normalizeAddress(m.address) === normalizeAddress(addr2));
          if (member1 && member2 && member1.address === member2.address) {
            return true;
          }
          if (member1 && !member2) {
            return false;
          }
        }
        return false;
      };
      const getTeamMemberName = (address) => {
        if (!address) return null;
        const member = teamStore.findTeamMemberByAddress(address);
        return (member == null ? void 0 : member.name) || null;
      };
      const formatAssignmentDisplay = (address) => {
        const name = getTeamMemberName(address);
        if (name) {
          if (name.length > 20) {
            return `${name.substring(0, 17)}...`;
          }
          return name;
        }
        return formatAddress(address, { forceShorten: true });
      };
      const assignButtonText = computed(() => {
        var _a;
        if (props.assignedTo) {
          const currentUserAddress = (_a = authStore.state.user) == null ? void 0 : _a.address;
          if (addressesMatch(props.assignedTo, currentUserAddress)) {
            return "Unassign";
          } else {
            return formatAssignmentDisplay(props.assignedTo);
          }
        }
        return "Assign to Me";
      });
      const assignButtonTooltip = computed(() => {
        var _a;
        if (!authStore.state.isAuthenticated) {
          return "Click to connect wallet and assign";
        }
        if (props.assignedTo) {
          const currentUserAddress = (_a = authStore.state.user) == null ? void 0 : _a.address;
          if (addressesMatch(props.assignedTo, currentUserAddress)) {
            return "Click to unassign yourself from this proposal";
          } else {
            const name = getTeamMemberName(props.assignedTo);
            if (name) {
              return `Assigned to: ${name} (${formatAddress(props.assignedTo, { forceShorten: true })})`;
            } else {
              return `Assigned to: ${props.assignedTo}`;
            }
          }
        }
        return "Assign this proposal to yourself";
      });
      const isAssignedToMe = computed(() => {
        var _a;
        return authStore.state.isAuthenticated && props.assignedTo && addressesMatch(props.assignedTo, (_a = authStore.state.user) == null ? void 0 : _a.address);
      });
      const canUnassign = computed(() => isAssignedToMe.value);
      const getVoteButtonTooltip = computed(() => {
        if (!authStore.state.isAuthenticated) {
          return "Please connect your wallet first";
        }
        if (!isAssignedToMe.value) {
          return "Only the assigned person can change the vote";
        }
        if (props.suggestedVote) {
          let tooltip = `Current vote: ${props.suggestedVote}`;
          if (props.reasonForVote) {
            tooltip += `
Reason: ${props.reasonForVote}`;
          }
          tooltip += "\n\nClick to change";
          return tooltip;
        }
        return "Set suggested vote";
      });
      const getTeamActionsTooltip = computed(() => {
        if (!authStore.state.isAuthenticated) {
          return "Please connect your wallet to access team actions";
        }
        return "Open team collaboration panel";
      });
      const statusConfig = {
        "Not started": { color: "#6c757d", icon: "●" },
        "Considering": { color: "#ffc107", icon: "●" },
        "Ready for approval": { color: "#17a2b8", icon: "●" },
        "Waiting for agreement": { color: "#fd7e14", icon: "●" },
        "Ready to vote": { color: "#28a745", icon: "●" },
        "Reconsidering": { color: "#dc3545", icon: "●" },
        "Voted 👍 Aye 👍": { color: "#198754", icon: "●" },
        "Voted 👎 Nay 👎": { color: "#dc3545", icon: "●" },
        "Voted ✌️ Abstain ✌️": { color: "#6f42c1", icon: "●" },
        "Not Voted": { color: "#e9ecef", icon: "●" }
      };
      const statusClass = computed(() => {
        return {
          "status-clickable": canChangeStatus.value,
          [`status-${props.status.toLowerCase().replace(/[^a-z0-9]/g, "-")}`]: true
        };
      });
      const statusIcon = computed(() => {
        var _a;
        return ((_a = statusConfig[props.status]) == null ? void 0 : _a.icon) || "⚪";
      });
      const canChangeStatus = computed(() => {
        var _a;
        if (!isAssignedToMe.value) {
          return false;
        }
        const allowedTransitions = {
          "Not started": [],
          // Can't manually change from Not started
          "Considering": ["Ready for approval"],
          // Can only move to Ready for approval
          "Ready for approval": ["Waiting for agreement", "Considering"],
          // Can move back to Considering or forward to Waiting
          "Waiting for agreement": ["Ready for approval"],
          // Can move back to Ready for approval
          "Ready to vote": [],
          // Automatic based on agreements
          "Reconsidering": ["Ready for approval"],
          // Can move back to Ready for approval
          "Voted 👍 Aye 👍": [],
          // Final states - can't change
          "Voted 👎 Nay 👎": [],
          // Final states - can't change
          "Voted ✌️ Abstain ✌️": [],
          // Final states - can't change
          "Not Voted": []
          // Final state - can't change
        };
        return ((_a = allowedTransitions[props.status]) == null ? void 0 : _a.length) > 0;
      });
      const handleStatusClick = () => {
        if (canChangeStatus.value) {
          showStatusModal.value = true;
        }
      };
      const closeStatusModal = () => {
        showStatusModal.value = false;
      };
      const getAllowedTransitions = (currentStatus) => {
        const allowedTransitions = {
          "Not started": [],
          // Can't manually change from Not started
          "Considering": ["Ready for approval"],
          // Can only move to Ready for approval
          "Ready for approval": ["Waiting for agreement", "Considering"],
          // Can move back to Considering or forward to Waiting
          "Waiting for agreement": ["Ready for approval"],
          // Can move back to Ready for approval
          "Ready to vote": [],
          // Automatic based on agreements
          "Reconsidering": ["Ready for approval"],
          // Can move back to Ready for approval
          "Voted 👍 Aye 👍": [],
          // Final states - can't change
          "Voted 👎 Nay 👎": [],
          // Final states - can't change
          "Voted ✌️ Abstain ✌️": [],
          // Final states - can't change
          "Not Voted": []
          // Final state - can't change
        };
        return allowedTransitions[currentStatus] || [];
      };
      const saveStatusChange = async (data) => {
        try {
          const allowedTransitions = getAllowedTransitions(props.status);
          if (!allowedTransitions.includes(data.newStatus)) {
            alert("This status transition is not allowed");
            return;
          }
          closeStatusModal();
          console.log("Status change requested:", { proposalId: props.proposalId, newStatus: data.newStatus, reason: data.reason });
          const result = await apiService.updateProposalStatus(props.proposalId, props.chain, data.newStatus);
          if (!result.success) {
            throw new Error(result.error || "Failed to update status");
          }
          console.log("✅ Status updated successfully");
          window.dispatchEvent(new CustomEvent("statusChanged", {
            detail: {
              proposalId: props.proposalId,
              newStatus: data.newStatus,
              reason: data.reason
            }
          }));
        } catch (error) {
          console.error("Failed to update status:", error);
          alert(error instanceof Error ? error.message : "Failed to update status");
        }
      };
      const handleAssignToMe = () => {
        if (!authStore.state.isAuthenticated) {
          showLoginPrompt("Please connect your wallet to assign proposals to yourself.");
          return;
        }
        if (canUnassign.value) {
          handleUnassign();
        } else {
          showAssignModal.value = true;
        }
      };
      const handleUnassign = () => {
        showUnassignModal.value = true;
      };
      const closeUnassignModal = () => {
        showUnassignModal.value = false;
      };
      const confirmUnassign = async (unassignNote) => {
        try {
          closeUnassignModal();
          console.log("Unassigning proposal with note:", unassignNote);
          const result = await apiService.unassignFromReferendum(props.proposalId, props.chain, unassignNote);
          if (!result.success) {
            throw new Error(result.error || "Failed to unassign proposal");
          }
          console.log("Successfully unassigned from proposal");
          window.dispatchEvent(new CustomEvent("proposalUnassigned", {
            detail: {
              proposalId: props.proposalId,
              chain: props.chain,
              note: unassignNote
            }
          }));
        } catch (error) {
          console.error("Failed to unassign proposal:", error);
          alert(error instanceof Error ? error.message : "Failed to unassign proposal");
        }
      };
      const closeAssignModal = () => {
        showAssignModal.value = false;
      };
      const confirmAssign = async () => {
        try {
          closeAssignModal();
          const assignData = {
            proposalId: props.proposalId,
            action: "responsible_person",
            autoStatus: "Considering"
            // Auto-change status to Considering
          };
          console.log("Assignment requested:", assignData);
          window.dispatchEvent(new CustomEvent("proposalAssigned", { detail: assignData }));
        } catch (error) {
          console.error("Failed to assign proposal:", error);
          alert(error instanceof Error ? error.message : "Failed to assign proposal");
        }
      };
      const handleChangeVote = () => {
        if (!authStore.state.isAuthenticated) {
          showLoginPrompt("Please connect your wallet to change suggested votes.");
          return;
        }
        if (!isAssignedToMe.value) {
          alert("Only the assigned person can change the vote");
          return;
        }
        showVoteModal.value = true;
      };
      const closeVoteModal = () => {
        showVoteModal.value = false;
      };
      const saveVoteChange = async (data) => {
        if (!isAssignedToMe.value) {
          alert("Only the assigned person can change the vote");
          return;
        }
        try {
          closeVoteModal();
          console.log("Suggested vote change requested:", { vote: data.vote, reason: data.reason });
          const result = await apiService.updateSuggestedVote(props.proposalId, props.chain, data.vote, data.reason);
          if (!result.success) {
            throw new Error(result.error || "Failed to update suggested vote");
          }
          console.log("✅ Suggested vote updated successfully");
          window.dispatchEvent(new CustomEvent("suggestedVoteChanged", {
            detail: {
              proposalId: props.proposalId,
              vote: data.vote,
              reason: data.reason
            }
          }));
        } catch (error) {
          console.error("Failed to update suggested vote:", error);
          alert(error instanceof Error ? error.message : "Failed to update suggested vote");
        }
      };
      const handleTeamActions = () => {
        if (!authStore.state.isAuthenticated) {
          showLoginPrompt("Please connect your wallet to access team collaboration features.");
          return;
        }
        showTeamPanel.value = true;
      };
      const closeTeamPanel = () => {
        showTeamPanel.value = false;
      };
      const handleTeamUpdate = () => {
        window.dispatchEvent(new CustomEvent("teamDataUpdated", { detail: { proposalId: props.proposalId } }));
      };
      const showLoginPrompt = (message) => {
        confirmModalData.value = {
          title: "Connect Wallet",
          message: `${message}

Would you like to connect your wallet now?`,
          onConfirm: () => {
            window.dispatchEvent(new CustomEvent("requestWalletConnection"));
          }
        };
        showConfirmModal.value = true;
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1, [
          createBaseVNode("div", _hoisted_2, [
            _cache[3] || (_cache[3] = createBaseVNode("h3", { class: "controls-title" }, "OpenGov Voting Tool", -1)),
            createBaseVNode("div", _hoisted_3, [
              createBaseVNode("div", {
                class: normalizeClass(["status-badge", statusClass.value]),
                onClick: handleStatusClick,
                title: _ctx.editable ? "Click to change status" : _ctx.status
              }, [
                createBaseVNode("span", _hoisted_5, toDisplayString(statusIcon.value), 1),
                createBaseVNode("span", _hoisted_6, toDisplayString(_ctx.status), 1)
              ], 10, _hoisted_4)
            ])
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("button", {
              id: "voting-tool-assign",
              class: "control-btn assign-btn",
              onClick: handleAssignToMe,
              title: assignButtonTooltip.value
            }, [
              createBaseVNode("span", _hoisted_9, toDisplayString(assignButtonText.value), 1)
            ], 8, _hoisted_8),
            createBaseVNode("button", {
              id: "voting-tool-change-vote",
              class: "control-btn vote-btn",
              onClick: handleChangeVote,
              disabled: !isAssignedToMe.value,
              title: getVoteButtonTooltip.value
            }, [
              createBaseVNode("span", _hoisted_11, toDisplayString(_ctx.suggestedVote || "No Suggested Vote"), 1)
            ], 8, _hoisted_10),
            createBaseVNode("button", {
              id: "voting-tool-team-actions",
              class: "control-btn team-btn",
              onClick: handleTeamActions,
              disabled: !unref(authStore).state.isAuthenticated,
              title: getTeamActionsTooltip.value
            }, [..._cache[4] || (_cache[4] = [
              createBaseVNode("span", { class: "btn-text" }, "Team Actions", -1)
            ])], 8, _hoisted_12)
          ]),
          createVNode(StatusChangeModal, {
            show: showStatusModal.value,
            "proposal-id": _ctx.proposalId,
            "current-status": _ctx.status,
            onClose: closeStatusModal,
            onSave: saveStatusChange
          }, null, 8, ["show", "proposal-id", "current-status"]),
          createVNode(AssignModal, {
            show: showAssignModal.value,
            "proposal-id": _ctx.proposalId,
            chain: props.chain,
            onClose: closeAssignModal,
            onConfirm: confirmAssign
          }, null, 8, ["show", "proposal-id", "chain"]),
          createVNode(UnassignModal, {
            show: showUnassignModal.value,
            "proposal-id": _ctx.proposalId,
            onClose: closeUnassignModal,
            onConfirm: confirmUnassign
          }, null, 8, ["show", "proposal-id"]),
          createVNode(VoteChangeModal, {
            show: showVoteModal.value,
            "proposal-id": _ctx.proposalId,
            "current-vote": _ctx.suggestedVote,
            "current-reason": _ctx.reasonForVote,
            onClose: closeVoteModal,
            onSave: saveVoteChange
          }, null, 8, ["show", "proposal-id", "current-vote", "current-reason"]),
          showTeamPanel.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "team-panel-overlay",
            onClick: closeTeamPanel
          }, [
            createBaseVNode("div", {
              class: "team-panel-wrapper",
              onClick: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["stop"]))
            }, [
              createVNode(TeamActionsPanel, {
                "proposal-id": _ctx.proposalId,
                chain: _ctx.chain,
                onClose: closeTeamPanel,
                onUpdated: handleTeamUpdate
              }, null, 8, ["proposal-id", "chain"])
            ])
          ])) : createCommentVNode("", true),
          createVNode(ConfirmModal, {
            show: showConfirmModal.value,
            title: confirmModalData.value.title,
            message: confirmModalData.value.message,
            type: "warning",
            onConfirm: _cache[1] || (_cache[1] = ($event) => {
              confirmModalData.value.onConfirm();
              showConfirmModal.value = false;
            }),
            onCancel: _cache[2] || (_cache[2] = ($event) => showConfirmModal.value = false)
          }, null, 8, ["show", "title", "message"])
        ]);
      };
    }
  });
  const VotingControls = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1a76a2ea"]]);
  const _ProposalDetector = class _ProposalDetector {
    static getInstance() {
      if (!_ProposalDetector.instance) {
        _ProposalDetector.instance = new _ProposalDetector();
      }
      return _ProposalDetector.instance;
    }
    /**
     * Detect if we're on a Polkassembly or Subsquare site
     */
    isSupportedSite() {
      const hostname = window.location.hostname;
      return hostname.includes("polkassembly.io") || hostname.includes("subsquare.io");
    }
    /**
     * Extract chain information from the URL
     */
    getChainFromUrl() {
      const hostname = window.location.hostname;
      if (hostname.includes("polkadot.")) {
        return "Polkadot";
      } else if (hostname.includes("kusama.")) {
        return "Kusama";
      }
      return null;
    }
    /**
     * Check if we're on a proposal/referendum page
     */
    isProposalPage() {
      const path = window.location.pathname;
      return /\/(referendum|proposal|referenda)\/\d+/.test(path);
    }
    /**
     * Extract proposal ID from URL
     */
    getProposalIdFromUrl() {
      const path = window.location.pathname;
      const match = path.match(/\/(referendum|proposal|referenda)\/(\d+)/);
      return match ? parseInt(match[2], 10) : null;
    }
    /**
     * Find proposal title element on the page
     */
    findTitleElement() {
      const selectors = [
        "h1",
        // Main title
        '[data-testid="proposal-title"]',
        ".proposal-title",
        ".referendum-title",
        "h1.text-2xl",
        // Tailwind classes commonly used
        "h1.font-bold",
        ".text-xl.font-semibold"
      ];
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.trim()) {
          return element;
        }
      }
      return null;
    }
    /**
     * Find the best location to inject status badge
     */
    findStatusBadgeLocation() {
      const titleElement = this.findTitleElement();
      if (!titleElement) return null;
      let current = titleElement;
      while (current && current !== document.body) {
        if (current.tagName.toLowerCase() === "tr") {
          return current;
        }
        current = current.parentElement;
      }
      let container = titleElement.parentElement;
      while (container && container !== document.body) {
        const hasMetadata = container.querySelector('[class*="meta"]') || container.querySelector('[class*="info"]') || container.querySelector(".text-sm") || container.querySelector(".text-gray");
        if (hasMetadata) {
          return container;
        }
        container = container.parentElement;
      }
      return titleElement.parentElement;
    }
    /**
     * Extract proposal title from the page
     */
    extractProposalTitle() {
      var _a;
      const titleElement = this.findTitleElement();
      if (!titleElement) return "Unknown Proposal";
      let title = ((_a = titleElement.textContent) == null ? void 0 : _a.trim()) || "Unknown Proposal";
      title = title.replace(/^(Referendum|Proposal)\s*#?\d+\s*:?\s*/i, "");
      title = title.replace(/^#\d+\s*:?\s*/, "");
      return title;
    }
    /**
     * Detect current proposal on the page
     */
    detectCurrentProposal() {
      if (!this.isSupportedSite() || !this.isProposalPage()) {
        return null;
      }
      const postId = this.getProposalIdFromUrl();
      const chain = this.getChainFromUrl();
      const title = this.extractProposalTitle();
      const titleElement = this.findTitleElement();
      const headerElement = this.findStatusBadgeLocation();
      if (!postId || !chain) {
        return null;
      }
      return {
        postId,
        title,
        chain,
        url: window.location.href,
        titleElement: titleElement || void 0,
        headerElement: headerElement || void 0
      };
    }
    isStillLoading() {
      console.log("🔍 Checking if still loading...");
      const loadingElement = document.querySelector("svg.animate-spin");
      if (!loadingElement) {
        console.log("🔍 No loading element found");
        return false;
      }
      const loadingElementRect = loadingElement.getBoundingClientRect();
      if (loadingElementRect.width === 0 && loadingElementRect.height === 0) {
        console.log("🔍 Loading element is not visible");
        return false;
      }
      console.log("🔍 Loading element is visible");
      return true;
    }
    /**
     * Detect all proposals on a list page
     */
    detectProposalsOnListPage() {
      if (!this.isSupportedSite()) {
        return [];
      }
      const proposals = [];
      const chain = this.getChainFromUrl();
      if (!chain) return proposals;
      const linkWrappers = document.querySelectorAll('a.contents[href*="/referenda/"], a.contents[href*="/referendum/"], a.contents[href*="/proposal/"]');
      console.log(`🔍 ProposalDetector: Found ${linkWrappers.length} link wrappers`);
      console.log('🔍 Looking for selectors: a.contents[href*="/referenda/"], a.contents[href*="/referendum/"], a.contents[href*="/proposal/"]');
      linkWrappers.forEach((linkWrapper, index) => {
        var _a;
        const anchor = linkWrapper;
        console.log(`🔗 Link wrapper ${index}: ${anchor.href}`);
        const match = anchor.href.match(/\/(referendum|proposal|referenda)\/(\d+)/);
        if (!match) {
          console.log(`  ❌ No match for: ${anchor.href}`);
          return;
        }
        const postId = parseInt(match[2], 10);
        const row = anchor.querySelector("tr");
        if (!row) {
          console.log(`  ❌ No TR found in link wrapper`);
          return;
        }
        const titleElement = row.querySelector('h1, h2, h3, .title, [class*="title"], td:first-child');
        const title = ((_a = titleElement == null ? void 0 : titleElement.textContent) == null ? void 0 : _a.trim()) || `${match[1]} #${postId}`;
        console.log(`  ✅ Found proposal #${postId}: ${title.substring(0, 50)}...`);
        proposals.push({
          postId,
          title,
          chain,
          url: anchor.href,
          titleElement,
          headerElement: anchor
          // Use the <a> wrapper as the header element
        });
      });
      if (proposals.length === 0) {
        const tableRows = document.querySelectorAll('tr.border-b, tr[class*="border"]');
        console.log(`🔍 ProposalDetector: Fallback - Found ${tableRows.length} table rows`);
        tableRows.forEach((row, index) => {
          const links = row.querySelectorAll('a[href*="/referendum/"], a[href*="/proposal/"], a[href*="/referenda/"]');
          console.log(`🔗 Row ${index}: Found ${links.length} proposal links`);
          links.forEach((link, linkIndex) => {
            var _a;
            const anchor = link;
            console.log(`  Link ${linkIndex}: ${anchor.href}`);
            const match = anchor.href.match(/\/(referendum|proposal|referenda)\/(\d+)/);
            if (!match) {
              console.log(`  ❌ No match for: ${anchor.href}`);
              return;
            }
            const postId = parseInt(match[2], 10);
            const titleElement = row.querySelector('h1, h2, h3, .title, [class*="title"], td:first-child');
            const title = ((_a = titleElement == null ? void 0 : titleElement.textContent) == null ? void 0 : _a.trim()) || `${match[1]} #${postId}`;
            console.log(`  ✅ Found proposal #${postId}: ${title.substring(0, 50)}...`);
            proposals.push({
              postId,
              title,
              chain,
              url: anchor.href,
              titleElement,
              headerElement: row
            });
          });
        });
      }
      if (proposals.length === 0) {
        const proposalSelectors = [
          'a[href*="/referendum/"]',
          'a[href*="/proposal/"]',
          'a[href*="/referenda/"]',
          '[class*="proposal-card"]',
          '[class*="referendum-card"]'
        ];
        for (const selector of proposalSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            var _a, _b;
            const link = element.getAttribute("href") || ((_a = element.querySelector("a")) == null ? void 0 : _a.getAttribute("href"));
            if (!link) return;
            const match = link.match(/\/(referendum|proposal|referenda)\/(\d+)/);
            if (!match) return;
            const postId = parseInt(match[2], 10);
            const titleElement = element.querySelector('h1, h2, h3, .title, [class*="title"]');
            const title = ((_b = titleElement == null ? void 0 : titleElement.textContent) == null ? void 0 : _b.trim()) || `${match[1]} #${postId}`;
            proposals.push({
              postId,
              title,
              chain,
              url: link.startsWith("http") ? link : `${window.location.origin}${link}`,
              titleElement,
              headerElement: element
            });
          });
        }
      }
      console.log(`🎯 ProposalDetector: Returning ${proposals.length} total proposals`);
      return proposals;
    }
    /**
     * Watch for page changes (SPA navigation)
     */
    watchForChanges(callback) {
      let currentUrl = window.location.href;
      const checkForChanges = () => {
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          setTimeout(() => {
            const proposal = this.detectCurrentProposal();
            callback(proposal);
          }, 500);
        }
      };
      window.addEventListener("popstate", checkForChanges);
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      history.pushState = function(...args) {
        originalPushState.apply(history, args);
        setTimeout(checkForChanges, 100);
      };
      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        setTimeout(checkForChanges, 100);
      };
      const observer = new MutationObserver(() => {
        checkForChanges();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return () => {
        window.removeEventListener("popstate", checkForChanges);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        observer.disconnect();
      };
    }
  };
  __publicField(_ProposalDetector, "instance");
  let ProposalDetector = _ProposalDetector;
  const _TabDetector = class _TabDetector {
    constructor() {
      // Map polkassembly categories to our Origin enum values
      __publicField(this, "POLKASSEMBLY_TO_ORIGIN_MAP", {
        "Root": "Root",
        "WishForChange": "Wish For Change",
        "BigSpender": "Big Spender",
        "MediumSpender": "Medium Spender",
        "SmallSpender": "Small Spender",
        "BigTipper": "Big Tipper",
        "SmallTipper": "Small Tipper",
        "Treasurer": "Treasurer",
        "WhitelistedCaller": "Whitelisted Caller",
        "ReferendumCanceller": "Referendum Canceller",
        "ReferendumKiller": "Referendum Killer"
      });
      // Categories from polkassembly that we don't track (so no badges should show)
      __publicField(this, "UNTRACKED_CATEGORIES", ["Discussion", "Staking Admin", "Lease Admin", "Fellowship Admin", "General Admin", "Auction Admin"]);
    }
    static getInstance() {
      if (!_TabDetector.instance) {
        _TabDetector.instance = new _TabDetector();
      }
      return _TabDetector.instance;
    }
    /**
     * Detect which tab is currently active on polkassembly
     */
    detectActiveTab() {
      console.log("🔍 TabDetector: Detecting active tab...");
      const activeButton = document.querySelector('button[data-state="active"][role="tab"], button[aria-selected="true"][role="tab"]');
      console.log("🔍 TabDetector: Found active button:", activeButton);
      if (!activeButton) {
        return {
          activeCategory: null,
          shouldShowBadges: false,
          isTrackedOrigin: false
        };
      }
      const category = this.extractCategoryFromButton(activeButton);
      console.log("🔍 TabDetector: Extracted category:", category);
      if (!category) {
        return {
          activeCategory: null,
          shouldShowBadges: false,
          isTrackedOrigin: false
        };
      }
      const isTrackedOrigin = this.isCategoryTracked(category);
      console.log("🔍 TabDetector: Is tracked origin:", isTrackedOrigin);
      const result = {
        activeCategory: category,
        shouldShowBadges: isTrackedOrigin,
        isTrackedOrigin
      };
      console.log("🔍 TabDetector: Final result:", result);
      return result;
    }
    /**
     * Extract category name from the active button
     */
    extractCategoryFromButton(button) {
      var _a;
      let category = button.getAttribute("data-value");
      if (!category) {
        const id = button.id;
        if (id) {
          const match = id.match(/trigger-(.+)$/);
          if (match) {
            category = match[1];
          }
        }
      }
      if (!category) {
        category = ((_a = button.textContent) == null ? void 0 : _a.trim()) || null;
      }
      if (category) {
        category = category.replace(/ /g, "");
      }
      console.log("🔍 TabDetector: Extracted category:", category);
      return category;
    }
    /**
     * Check if a category is tracked in our Origin enum
     */
    isCategoryTracked(category) {
      if (this.UNTRACKED_CATEGORIES.includes(category)) {
        return false;
      }
      return this.POLKASSEMBLY_TO_ORIGIN_MAP.hasOwnProperty(category) || category.includes("all");
    }
    /**
     * Get the mapped Origin enum value for a polkassembly category
     */
    getOriginForCategory(category) {
      if (category.includes("All")) {
        return "All";
      }
      return this.POLKASSEMBLY_TO_ORIGIN_MAP[category] || null;
    }
    /**
     * Watch for tab changes and call callback when active tab changes
     */
    watchForTabChanges(callback) {
      let currentActiveTab = this.detectActiveTab();
      const checkForTabChanges = () => {
        const newActiveTab = this.detectActiveTab();
        if (newActiveTab.activeCategory !== currentActiveTab.activeCategory) {
          console.log("🔄 Tab changed from", currentActiveTab.activeCategory, "to", newActiveTab.activeCategory);
          currentActiveTab = newActiveTab;
          callback(newActiveTab);
        }
      };
      const handleTabClick = (event) => {
        const target = event.target;
        if (target.matches('button[role="tab"]')) {
          setTimeout(checkForTabChanges, 100);
        }
      };
      const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes") {
            const target = mutation.target;
            if (target.matches('button[role="tab"]') && (mutation.attributeName === "data-state" || mutation.attributeName === "aria-selected")) {
              shouldCheck = true;
            }
          }
        });
        if (shouldCheck) {
          setTimeout(checkForTabChanges, 50);
        }
      });
      document.addEventListener("click", handleTabClick);
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-state", "aria-selected"]
      });
      return () => {
        document.removeEventListener("click", handleTabClick);
        observer.disconnect();
      };
    }
    /**
     * Check if we're on a page that has category tabs
     */
    isOnCategoryPage() {
      const tabButtons = document.querySelectorAll('button[role="tab"]');
      return tabButtons.length > 0;
    }
  };
  __publicField(_TabDetector, "instance");
  let TabDetector = _TabDetector;
  const _ContentInjector = class _ContentInjector {
    constructor() {
      __publicField(this, "detector");
      __publicField(this, "tabDetector");
      __publicField(this, "apiService");
      __publicField(this, "injectedComponents", /* @__PURE__ */ new Map());
      __publicField(this, "proposalCache", /* @__PURE__ */ new Map());
      __publicField(this, "cleanupFunctions", []);
      __publicField(this, "currentActiveTab", null);
      __publicField(this, "isInjecting", false);
      __publicField(this, "isInitialized", false);
      __publicField(this, "currentProposalId", null);
      this.detector = ProposalDetector.getInstance();
      this.tabDetector = TabDetector.getInstance();
      this.apiService = ApiService.getInstance();
    }
    static getInstance() {
      if (!_ContentInjector.instance) {
        _ContentInjector.instance = new _ContentInjector();
      }
      return _ContentInjector.instance;
    }
    /**
     * Initialize the content injector
     */
    async initialize() {
      if (this.isInitialized) {
        console.log("ℹ️ Content injector already initialized, skipping...");
        return;
      }
      console.log("🚀 Initializing OpenGov VotingTool Content Injector");
      if (!this.detector.isSupportedSite()) {
        console.log("❌ Not on a supported site");
        return;
      }
      this.isInitialized = true;
      this.currentActiveTab = this.tabDetector.detectActiveTab();
      await this.handlePageChange();
      const cleanup = this.detector.watchForChanges(async (proposal) => {
        await this.handlePageChange();
      });
      this.cleanupFunctions.push(cleanup);
      const tabCleanup = this.tabDetector.watchForTabChanges(async (tabInfo) => {
        console.log("🔄 Tab change detected:", tabInfo);
        this.currentActiveTab = tabInfo;
        await this.handleTabChange(tabInfo);
      });
      this.cleanupFunctions.push(tabCleanup);
      console.log("ℹ️ Using initialization strategies without mutation observer to prevent blinking");
      window.addEventListener("statusChanged", this.handleStatusChange.bind(this));
      window.addEventListener("proposalAssigned", this.handleProposalAssigned.bind(this));
      window.addEventListener("proposalUnassigned", this.handleProposalUnassigned.bind(this));
      window.addEventListener("voteChanged", this.handleVoteChanged.bind(this));
      window.addEventListener("suggestedVoteChanged", this.handleSuggestedVoteChanged.bind(this));
      window.addEventListener("authStateChanged", this.handleAuthStateChanged.bind(this));
      window.addEventListener("requestWalletConnection", this.handleWalletConnectionRequest.bind(this));
      console.log("✅ Content injector initialized");
    }
    /**
     * Handle tab changes and re-render badges if needed
     */
    async handleTabChange(tabInfo) {
      console.log("🔄 Handling tab change:", tabInfo);
      if (this.tabDetector.isOnCategoryPage()) {
        console.log("🔄 Tab change detected on category page, checking if re-injection needed");
        await this.handlePageChange();
      }
    }
    /**
     * Re-inject all components to reflect authentication changes
     */
    async refreshAllComponents() {
      console.log("🔄 Refreshing all components due to authentication change");
      await this.handlePageChange();
    }
    /**
     * Handle page changes and inject appropriate components
     */
    async handlePageChange() {
      console.log("📄 Page change detected, checking for proposals...");
      console.log("🔍 Current URL:", window.location.href);
      if (this.detector.isProposalPage()) {
        const proposal = this.detector.detectCurrentProposal();
        if (proposal) {
          console.log("📋 Detected single proposal:", proposal);
          if (this.currentProposalId !== proposal.postId) {
            console.log(`🔄 Proposal changed from ${this.currentProposalId} to ${proposal.postId}, cleaning up...`);
            this.cleanupExistingInjections();
            this.currentProposalId = proposal.postId;
            await this.injectProposalComponents(proposal);
          } else {
            console.log(`✅ Same proposal ${proposal.postId}, skipping cleanup and re-injection`);
          }
        } else {
          console.log("❌ No proposal detected on proposal page");
          if (this.currentProposalId !== null) {
            console.log("🧹 No proposal detected, cleaning up previous injections");
            this.cleanupExistingInjections();
            this.currentProposalId = null;
          }
        }
      } else {
        console.log('🔍 Searching for table rows with selectors: tr.border-b, tr[class*="border"]');
        const tableRows = document.querySelectorAll('tr.border-b, tr[class*="border"]');
        console.log("📊 Found table rows:", tableRows.length);
        while (this.detector.isStillLoading()) {
          await sleep(1e3);
          console.log("🔍 Still loading, waiting for 1 second...");
        }
        const proposals = this.detector.detectProposalsOnListPage();
        if (proposals.length > 0) {
          console.log("📋 Detected proposals on list page:", proposals.length);
          proposals.forEach((p2, index) => {
            console.log(`  Proposal ${index}: #${p2.postId} - ${p2.title.substring(0, 50)}...`);
          });
          this.cleanupExistingInjections();
          this.currentProposalId = null;
          await this.injectListPageComponents(proposals);
        } else {
          console.log("❌ No proposals detected on list page");
          if (this.currentProposalId !== null || this.injectedComponents.size > 0) {
            console.log("🧹 Not on a recognized page, cleaning up all injections");
            this.cleanupExistingInjections();
            this.currentProposalId = null;
          }
        }
      }
    }
    /**
     * Inject components for a single proposal page
     */
    async injectProposalComponents(proposal) {
      const proposalData = await this.getProposalData(proposal.postId, proposal.chain);
      const referendaDetailPattern = /\/referenda\/\d+/;
      if (referendaDetailPattern.test(window.location.pathname)) {
        console.log("📋 Detected referenda detail page, injecting voting controls");
        console.log("🔍 URL:", window.location.pathname);
        console.log("✅ Referenda detail pages always show voting controls, ignoring tab restrictions");
        await sleep(500);
        await this.injectVotingControls(proposal, proposalData);
      } else {
        if (this.tabDetector.isOnCategoryPage()) {
          const currentTab = this.currentActiveTab || this.tabDetector.detectActiveTab();
          if (!currentTab.shouldShowBadges) {
            console.log(`⏸️ Not showing badge for list page - active tab "${currentTab.activeCategory}" is not tracked`);
            return;
          }
        }
        await this.injectStatusBadge(proposal, proposalData);
      }
    }
    /**
     * Inject components for proposal list pages
     */
    async injectListPageComponents(proposals) {
      console.log(`🚀 Starting injection for ${proposals.length} proposals`);
      const currentTab = this.currentActiveTab || this.tabDetector.detectActiveTab();
      if (!currentTab.shouldShowBadges) {
        console.log(`⏸️ Not showing badges - active tab "${currentTab.activeCategory}" is not tracked`);
        return;
      }
      console.log(`✅ Showing badges - active tab "${currentTab.activeCategory}" is tracked`);
      for (let i = 0; i < proposals.length; i++) {
        const proposal = proposals[i];
        console.log(`📌 Processing proposal ${i + 1}/${proposals.length}: #${proposal.postId}`);
        try {
          const proposalData = await this.getProposalData(proposal.postId, proposal.chain);
          await this.injectStatusBadge(proposal, proposalData);
          console.log(`✅ Successfully injected badge for proposal #${proposal.postId}`);
        } catch (error) {
          console.error(`❌ Failed to inject badge for proposal #${proposal.postId}:`, error);
        }
      }
      console.log(`🎉 Completed injection for all ${proposals.length} proposals`);
    }
    /**
     * Inject voting controls component for referenda detail pages
     */
    async injectVotingControls(proposal, proposalData) {
      try {
        console.log("🎯 Injecting voting controls for proposal", proposal.postId);
        console.log("🔍 Current URL:", window.location.href);
        if (this.isInjecting) {
          console.log("⚠️ Already injecting voting controls, skipping to prevent race condition");
          return;
        }
        const existingControls = document.querySelector("#voting-tool-controls") || document.querySelector("#voting-tool-controls-container") || document.querySelector(`[data-opengov-proposal="${proposal.postId}"]`);
        if (existingControls) {
          console.log("⚠️ Voting controls already exist for proposal", proposal.postId, ", skipping");
          return;
        }
        this.isInjecting = true;
        let rightWrapper = null;
        let retryCount = 0;
        const maxRetries = 10;
        console.log("🔄 Starting aggressive retry mechanism for referenda page...");
        while (!rightWrapper && retryCount < maxRetries) {
          retryCount++;
          console.log(`🔄 Attempt ${retryCount}/${maxRetries} to find PostDetails_rightWrapper...`);
          if (retryCount > 1) {
            await sleep(1e3);
          }
          rightWrapper = this.findPostDetailsRightWrapper();
          if (rightWrapper) {
            console.log(`✅ Found element on attempt ${retryCount}!`);
            break;
          } else {
            console.log(`❌ Attempt ${retryCount} failed, element not found`);
          }
        }
        if (!rightWrapper) {
          console.error("💥 CRITICAL: PostDetails_rightWrapper not found after 10 retries on referenda page!");
          console.error("💥 This should never happen on a valid referenda page");
          console.error("💥 URL:", window.location.href);
          console.error("💥 Page title:", document.title);
          console.error("💥 Body HTML preview:", document.body.innerHTML.substring(0, 500));
          console.log("🆘 Creating emergency fallback container...");
          rightWrapper = document.createElement("div");
          rightWrapper.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1000000;
                max-width: 400px;
                background: rgba(255, 0, 0, 0.9);
                color: white;
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 2px solid red;
            `;
          const errorMsg = document.createElement("div");
          errorMsg.innerHTML = `
                <strong>⚠️ FALLBACK MODE</strong><br>
                Could not find page element.<br>
                Please report this issue.
            `;
          rightWrapper.appendChild(errorMsg);
          document.body.appendChild(rightWrapper);
          console.log("🆘 Emergency fallback container created");
        }
        console.log("✅ Using wrapper element:", rightWrapper.className || "fallback-container");
        const container = document.createElement("div");
        container.id = "voting-tool-controls-container";
        container.setAttribute("data-opengov-proposal", proposal.postId.toString());
        rightWrapper.insertBefore(container, rightWrapper.firstChild);
        let assignedTo = null;
        let teamMembers = [];
        try {
          assignedTo = (proposalData == null ? void 0 : proposalData.assigned_to) || null;
          if (assignedTo) {
            console.log(`📋 Proposal ${proposal.postId} is assigned to:`, assignedTo);
          }
          const agreementSummary = await this.apiService.getAgreementSummary(proposal.postId, proposal.chain);
          if (agreementSummary) {
            const allMembers = [
              ...agreementSummary.agreed_members,
              ...agreementSummary.pending_members,
              ...agreementSummary.recused_members,
              ...agreementSummary.to_be_discussed_members
            ];
            teamMembers = allMembers.filter(
              (member, index, self2) => index === self2.findIndex((m) => m.address === member.address)
            );
            console.log(`👥 Found ${teamMembers.length} team members for name resolution`);
          }
        } catch (error) {
          console.warn("⚠️ Could not fetch assignment data:", error);
        }
        const app = createApp(VotingControls, {
          status: (proposalData == null ? void 0 : proposalData.internal_status) || "Not started",
          proposalId: proposal.postId,
          editable: this.apiService.isAuthenticated(),
          isAuthenticated: this.apiService.isAuthenticated(),
          suggestedVote: (proposalData == null ? void 0 : proposalData.suggested_vote) || null,
          reasonForVote: (proposalData == null ? void 0 : proposalData.reason_for_vote) || null,
          assignedTo,
          teamMembers,
          chain: proposal.chain
        });
        app.mount(container);
        this.injectedComponents.set(proposal.postId, app);
        console.log("✅ Injected voting controls for proposal", proposal.postId);
      } catch (error) {
        console.error("❌ Error injecting voting controls:", error);
      } finally {
        this.isInjecting = false;
      }
    }
    /**
     * Find PostDetails_rightWrapper element with dynamic class names
     */
    findPostDetailsRightWrapper() {
      var _a;
      console.log("🔍 Looking for PostDetails_rightWrapper element...");
      const selectors = [
        // Most specific Polkassembly patterns first - these should match the dynamic classes
        '[class*="PostDetails_rightWrapper__"]',
        // More specific to avoid false matches
        '[class*="PostDetails_rightWrapper"]',
        '[class*="rightWrapper__"]',
        // Match generated class patterns
        '[class*="rightWrapper"]',
        '[class*="right-wrapper"]',
        // Common layout patterns
        ".flex.flex-col.gap-6",
        ".flex.flex-col.space-y-6",
        ".space-y-6",
        ".gap-6",
        // Grid-based layouts
        ".grid-cols-12 > div:last-child",
        ".col-12.col-lg-8",
        ".col-lg-8",
        ".col-lg-4",
        // Sometimes it's a 4-column layout
        ".col-md-8",
        ".col-md-4",
        // Generic right-side patterns
        '[class*="right-col"]',
        '[class*="rightCol"]',
        '[class*="right-side"]',
        '[class*="rightSide"]',
        '[class*="sidebar"]',
        '[class*="side-bar"]',
        // Main content area patterns
        "main .flex-col:last-child",
        "main > div > div:last-child",
        "main > div:last-child",
        ".container .row > div:last-child",
        ".container > div:last-child",
        // Flex-based patterns
        ".flex > div:last-child",
        ".flex-row > div:last-child",
        ".d-flex > div:last-child",
        // Generic content patterns
        '[class*="content"] > div:last-child',
        '[class*="wrapper"] > div:last-child',
        ".row > .col:last-child",
        ".row > div:last-child"
      ];
      console.log("🔍 Available elements on page:");
      const allDivs = document.querySelectorAll('div[class*="col"], div[class*="flex"], div[class*="grid"], div[class*="right"], div[class*="wrapper"]');
      console.log(`Found ${allDivs.length} potential wrapper elements`);
      for (let i = 0; i < Math.min(5, allDivs.length); i++) {
        const div = allDivs[i];
        console.log(`Element ${i}: ${div.tagName}.${div.className}`);
      }
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
        for (const element of elements) {
          const htmlElement = element;
          const hasTypicalContent = htmlElement.querySelector('[class*="card"]') || htmlElement.querySelector('[class*="panel"]') || htmlElement.querySelector(".bg-white") || htmlElement.querySelector('[class*="border"]') || htmlElement.querySelector("button") || htmlElement.querySelector('[class*="vote"]') || htmlElement.querySelector('[class*="details"]') || htmlElement.querySelector('[class*="info"]') || htmlElement.querySelector('[class*="summary"]') || htmlElement.querySelector('[class*="description"]') || htmlElement.querySelector("p") || htmlElement.querySelector("div > div") || // Nested divs indicate structure
          htmlElement.textContent && htmlElement.textContent.trim().length > 30;
          const rect = htmlElement.getBoundingClientRect();
          const isReasonableSize = rect.width > 50 && rect.height > 50;
          const isVisible = rect.width > 0 && rect.height > 0;
          console.log(`🔍 Element check: selector="${selector}"`);
          console.log(`    hasContent=${!!hasTypicalContent}, size=${rect.width}x${rect.height}, visible=${isVisible}`);
          console.log(`    classes="${htmlElement.className}"`);
          const isSpecificTarget = selector.includes("PostDetails") || selector.includes("rightWrapper");
          if (hasTypicalContent && isReasonableSize && isVisible || isSpecificTarget && isVisible) {
            console.log("🎯 Found PostDetails_rightWrapper with selector:", selector);
            console.log("🎯 Element class:", htmlElement.className);
            console.log("🎯 Element position:", { left: rect.left, width: rect.width, height: rect.height });
            console.log("🎯 Element text preview:", (_a = htmlElement.textContent) == null ? void 0 : _a.substring(0, 100));
            return htmlElement;
          }
        }
      }
      console.log("🔍 Trying voting-related content fallback...");
      const votingContainers = document.querySelectorAll('[class*="vote"], [class*="detail"], [class*="info"]');
      for (const container of votingContainers) {
        const htmlElement = container;
        const rect = htmlElement.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 100) {
          console.log("🎯 Found voting-related container as fallback");
          console.log("🎯 Container class:", htmlElement.className);
          return htmlElement;
        }
      }
      console.log("🔍 Trying largest right-side container fallback...");
      const allContainers = document.querySelectorAll("div");
      let bestContainer = null;
      let bestScore = 0;
      for (const container of allContainers) {
        const htmlElement = container;
        const rect = htmlElement.getBoundingClientRect();
        const score = rect.width * rect.height * (rect.left > window.innerWidth * 0.4 ? 2 : 1);
        if (score > bestScore && rect.width > 200 && rect.height > 200) {
          bestScore = score;
          bestContainer = htmlElement;
        }
      }
      if (bestContainer) {
        console.log("🎯 Found best container as final fallback");
        console.log("🎯 Best container class:", bestContainer.className);
        return bestContainer;
      }
      console.warn("❌ Could not find any suitable PostDetails_rightWrapper element");
      console.warn("❌ Page structure may be different than expected");
      return null;
    }
    /**
     * Inject status badge component
     */
    async injectStatusBadge(proposal, proposalData) {
      return;
    }
    /**
     * Find the best parent element for positioning the badge (focused on row-level positioning)
     */
    findRowPositioningParent(targetElement) {
      if (targetElement.tagName.toLowerCase() === "a") {
        const tr = targetElement.querySelector("tr");
        if (tr) {
          console.log("🔗 Found TR inside A tag, using TR for positioning");
          return tr;
        }
      }
      let current = targetElement;
      while (current && current !== document.body) {
        if (current.tagName.toLowerCase() === "tr") {
          console.log("🔗 Found TR, using TR for positioning");
          return current;
        }
        current = current.parentElement;
      }
      return targetElement;
    }
    /**
     * Find the best parent element for positioning the badge (legacy method)
     */
    findPositioningParent(targetElement) {
      let current = targetElement;
      while (current && current !== document.body) {
        if (current.tagName.toLowerCase() === "tr") {
          return current.parentElement || current;
        }
        const style = window.getComputedStyle(current);
        if (style.position !== "static") {
          return current;
        }
        current = current.parentElement;
      }
      return targetElement;
    }
    /**
     * Fix overflow clipping that would hide badges positioned outside the container
     */
    fixOverflowClipping(positioningParent) {
      let current = positioningParent;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const hasClippingOverflow = style.overflowX === "auto" || style.overflowX === "scroll" || style.overflowX === "hidden" || style.overflow === "auto" || style.overflow === "scroll" || style.overflow === "hidden";
        if (hasClippingOverflow) {
          console.log("🔧 Found overflow container, adjusting:", {
            element: current.tagName + "." + current.className,
            originalOverflow: {
              overflow: style.overflow,
              overflowX: style.overflowX,
              overflowY: style.overflowY
            }
          });
          if (!current.hasAttribute("data-opengov-original-overflow-x")) {
            current.setAttribute("data-opengov-original-overflow-x", style.overflowX);
            current.setAttribute("data-opengov-original-overflow", style.overflow);
            current.setAttribute("data-opengov-original-overflow-y", style.overflowY);
          }
          current.style.setProperty("overflow-x", "visible", "important");
          current.style.setProperty("overflow", "visible", "important");
          if (style.overflowY === "visible" || style.overflowY === "auto" || style.overflowY === "scroll") {
            current.style.setProperty("overflow-y", style.overflowY, "important");
          }
        }
        current = current.parentElement;
      }
    }
    /**
     * Update existing components with fresh data without full re-injection
     */
    async updateExistingComponents(proposalId, proposalData) {
      console.log("🔄 Updating existing components with new data for proposal:", proposalId);
      try {
        let teamMembers = [];
        if (proposalData == null ? void 0 : proposalData.chain) {
          const agreementSummary = await this.apiService.getAgreementSummary(proposalId, proposalData.chain);
          if (agreementSummary) {
            const allMembers = [
              ...agreementSummary.agreed_members,
              ...agreementSummary.pending_members,
              ...agreementSummary.recused_members,
              ...agreementSummary.to_be_discussed_members
            ];
            teamMembers = allMembers.filter(
              (member, index, self2) => index === self2.findIndex((m) => m.address === member.address)
            );
          }
        }
        const existingApp = this.injectedComponents.get(proposalId);
        if (existingApp) {
          existingApp.unmount();
          this.injectedComponents.delete(proposalId);
        }
        const container = document.getElementById("voting-tool-controls-container");
        if (!container) {
          console.warn("⚠️ Could not find controls container for update");
          return;
        }
        const app = createApp(VotingControls, {
          status: (proposalData == null ? void 0 : proposalData.internal_status) || "Not started",
          proposalId,
          editable: this.apiService.isAuthenticated(),
          isAuthenticated: this.apiService.isAuthenticated(),
          suggestedVote: (proposalData == null ? void 0 : proposalData.suggested_vote) || null,
          reasonForVote: (proposalData == null ? void 0 : proposalData.reason_for_vote) || null,
          assignedTo: (proposalData == null ? void 0 : proposalData.assigned_to) || null,
          teamMembers,
          chain: (proposalData == null ? void 0 : proposalData.chain) || "Polkadot"
        });
        app.mount(container);
        this.injectedComponents.set(proposalId, app);
        console.log("✅ Updated existing component with fresh data");
      } catch (error) {
        console.error("❌ Error updating existing components:", error);
      }
    }
    /**
     * Get proposal data from API with caching
     */
    async getProposalData(postId, chain) {
      const cacheKey = `${chain}-${postId}`;
      if (this.proposalCache.has(cacheKey)) {
        return this.proposalCache.get(cacheKey) || null;
      }
      const proposalData = await this.apiService.getProposal(postId, chain);
      if (proposalData) {
        this.proposalCache.set(cacheKey, proposalData);
      }
      return proposalData;
    }
    /**
     * Handle status change events from components
     */
    async handleStatusChange(event) {
      const customEvent = event;
      const { proposalId, newStatus, reason } = customEvent.detail;
      console.log("📝 Status change event received:", customEvent.detail);
      console.log("🔄 Refreshing UI after status change...");
      try {
        const currentProposal = this.detector.detectCurrentProposal();
        if (!currentProposal) {
          console.error("Could not determine current proposal for status change");
          return;
        }
        const cacheKey = `${currentProposal.chain}-${proposalId}`;
        this.proposalCache.delete(cacheKey);
        const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
        await this.updateExistingComponents(proposalId, updatedProposalData);
        console.log("✅ UI refreshed successfully after status change");
      } catch (error) {
        console.error("❌ Failed to refresh UI after status change:", error);
      }
    }
    /**
     * Handle proposal assignment events from components
     */
    async handleProposalAssigned(event) {
      const customEvent = event;
      const { proposalId, action, autoStatus } = customEvent.detail;
      console.log("👤 Proposal assignment requested:", customEvent.detail);
      try {
        const currentProposal = this.detector.detectCurrentProposal();
        if (!currentProposal) {
          console.error("Could not determine current proposal for assignment");
          return;
        }
        if (!this.apiService.isAuthenticated()) {
          console.error("User not authenticated for assignment");
          alert("Please authenticate to assign proposals");
          return;
        }
        const result = await this.apiService.assignProposal(
          proposalId,
          currentProposal.chain,
          action
        );
        if (result.success) {
          console.log("✅ Proposal assigned successfully");
          if (autoStatus) {
            console.log(`🔄 Auto-updating status to: ${autoStatus}`);
            const statusResult = await this.apiService.updateProposalStatus(
              proposalId,
              currentProposal.chain,
              autoStatus
            );
            if (statusResult.success) {
              console.log("✅ Status auto-updated successfully");
            } else {
              console.error("❌ Failed to auto-update status:", statusResult.error);
            }
          }
          const cacheKey = `${currentProposal.chain}-${proposalId}`;
          this.proposalCache.delete(cacheKey);
          const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
          await this.updateExistingComponents(proposalId, updatedProposalData);
        } else {
          console.error("❌ Failed to assign proposal:", result.error);
          alert(`Failed to assign proposal: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("❌ Failed to assign proposal:", error);
        alert("Failed to assign proposal. Please check your connection and try again.");
      }
    }
    /**
     * Handle suggested vote changes from components
     */
    async handleSuggestedVoteChanged(event) {
      const customEvent = event;
      const { proposalId, vote, reason } = customEvent.detail;
      console.log("🗳️ Suggested vote change event received:", customEvent.detail);
      console.log("🔄 Refreshing UI after vote change...");
      try {
        const currentProposal = this.detector.detectCurrentProposal();
        if (!currentProposal) {
          console.error("Could not determine current proposal for vote change");
          return;
        }
        const cacheKey = `${currentProposal.chain}-${proposalId}`;
        this.proposalCache.delete(cacheKey);
        const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
        await this.updateExistingComponents(proposalId, updatedProposalData);
        console.log("✅ UI refreshed successfully after vote change");
      } catch (error) {
        console.error("❌ Failed to refresh UI after vote change:", error);
      }
    }
    /**
     * Handle wallet connection requests from components
     */
    handleWalletConnectionRequest(event) {
      console.log("🔗 Wallet connection requested from component");
      const hamburgerButton = document.querySelector(".floating-button");
      if (hamburgerButton) {
        hamburgerButton.click();
        console.log("✅ Opened wallet connection menu");
      } else {
        console.warn("⚠️ Could not find floating hamburger button");
        alert("Please click the pink floating button in the bottom-right corner to connect your wallet.");
      }
    }
    /**
     * Handle authentication state changes
     */
    async handleAuthStateChanged(event) {
      const customEvent = event;
      const { isAuthenticated } = customEvent.detail;
      console.log("🔐 Authentication state changed:", isAuthenticated);
      await this.refreshAllComponents();
    }
    /**
     * Handle proposal unassignment events from components
     */
    async handleProposalUnassigned(event) {
      const customEvent = event;
      const { proposalId, chain, note } = customEvent.detail;
      console.log("👤 Proposal unassignment event received:", customEvent.detail);
      console.log("🔄 Refreshing UI after unassignment...");
      try {
        const cacheKey = `${chain}-${proposalId}`;
        this.proposalCache.delete(cacheKey);
        const updatedProposalData = await this.getProposalData(proposalId, chain);
        await this.updateExistingComponents(proposalId, updatedProposalData);
        console.log("✅ UI refreshed successfully after unassignment");
      } catch (error) {
        console.error("❌ Failed to refresh UI after unassignment:", error);
      }
    }
    /**
     * Handle vote change events from components
     */
    async handleVoteChanged(event) {
      const customEvent = event;
      const { proposalId, vote, reason } = customEvent.detail;
      console.log("🗳️ Final vote change requested:", customEvent.detail);
      try {
        const currentProposal = this.detector.detectCurrentProposal();
        if (!currentProposal) {
          console.error("Could not determine current proposal for vote change");
          return;
        }
        if (!this.apiService.isAuthenticated()) {
          console.error("User not authenticated for vote change");
          alert("Please authenticate to change final votes");
          return;
        }
        const result = await this.apiService.updateFinalVote(
          proposalId,
          currentProposal.chain,
          vote,
          reason
        );
        if (result.success) {
          console.log("✅ Final vote updated successfully");
          const cacheKey = `${currentProposal.chain}-${proposalId}`;
          this.proposalCache.delete(cacheKey);
          const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
          await this.updateExistingComponents(proposalId, updatedProposalData);
        } else {
          console.error("❌ Failed to update final vote:", result.error);
          alert(`Failed to update final vote: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("❌ Failed to update final vote:", error);
        alert("Failed to update final vote. Please check your connection and try again.");
      }
    }
    /**
     * Clean up existing injections
     */
    cleanupExistingInjections() {
      this.injectedComponents.forEach((app, postId) => {
        try {
          app.unmount();
        } catch (error) {
          console.warn("Error unmounting app for proposal", postId, error);
        }
      });
      this.injectedComponents.clear();
      document.querySelectorAll(".opengov-status-badge, .opengov-status-badge-floating").forEach((element) => {
        const wrapper = element.parentElement;
        if (wrapper && wrapper.style.position === "absolute" && wrapper.style.left === "-110px") {
          wrapper.remove();
        } else {
          element.remove();
        }
      });
      document.querySelectorAll("#voting-tool-controls, #voting-tool-controls-container").forEach((element) => {
        const parent = element.parentElement;
        if (parent && parent.style.position === "fixed" && parent.style.right === "20px") {
          parent.remove();
        } else {
          element.remove();
        }
      });
      document.querySelectorAll("[data-opengov-original-overflow-x]").forEach((element) => {
        const htmlElement = element;
        const originalOverflowX = element.getAttribute("data-opengov-original-overflow-x");
        const originalOverflow = element.getAttribute("data-opengov-original-overflow");
        const originalOverflowY = element.getAttribute("data-opengov-original-overflow-y");
        if (originalOverflowX) {
          htmlElement.style.removeProperty("overflow-x");
          htmlElement.style.overflowX = originalOverflowX;
          element.removeAttribute("data-opengov-original-overflow-x");
        }
        if (originalOverflow) {
          htmlElement.style.removeProperty("overflow");
          htmlElement.style.overflow = originalOverflow;
          element.removeAttribute("data-opengov-original-overflow");
        }
        if (originalOverflowY) {
          htmlElement.style.removeProperty("overflow-y");
          htmlElement.style.overflowY = originalOverflowY;
          element.removeAttribute("data-opengov-original-overflow-y");
        }
      });
    }
    /**
     * Clean up all resources
     */
    cleanup() {
      this.cleanupExistingInjections();
      this.cleanupFunctions.forEach((cleanup) => cleanup());
      this.cleanupFunctions = [];
      this.isInjecting = false;
      window.removeEventListener("statusChanged", this.handleStatusChange.bind(this));
      window.removeEventListener("proposalAssigned", this.handleProposalAssigned.bind(this));
      window.removeEventListener("proposalUnassigned", this.handleProposalUnassigned.bind(this));
      window.removeEventListener("voteChanged", this.handleVoteChanged.bind(this));
      window.removeEventListener("suggestedVoteChanged", this.handleSuggestedVoteChanged.bind(this));
      window.removeEventListener("authStateChanged", this.handleAuthStateChanged.bind(this));
      window.removeEventListener("requestWalletConnection", this.handleWalletConnectionRequest.bind(this));
      this.proposalCache.clear();
      this.isInitialized = false;
      this.currentProposalId = null;
      console.log("🧹 Content injector cleaned up");
    }
  };
  __publicField(_ContentInjector, "instance");
  let ContentInjector = _ContentInjector;
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (window.opengovVotingToolInitialized) {
    throw new Error("Already initialized");
  }
  window.opengovVotingToolInitialized = true;
  let contentInjector = null;
  async function initializeExtension() {
    try {
      const extensionContainer = document.createElement("div");
      extensionContainer.id = "opengov-voting-extension";
      extensionContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
    `;
      document.body.appendChild(extensionContainer);
      const app = createApp(App);
      app.mount("#opengov-voting-extension");
      contentInjector = ContentInjector.getInstance();
      await contentInjector.initialize();
      await proposalStore.initialize();
      await teamStore.initialize();
    } catch (error) {
      console.error("❌ OpenGov VotingTool Extension - Initialization failed:", error);
    }
  }
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("inject.js");
  script.onload = () => {
    script.remove();
  };
  document.head.appendChild(script);
  window.addEventListener("message", function(event) {
    if (event.source !== window) return;
    if (event.data.type === "WALLET_EXTENSION_RESULT") {
      window.opengovVotingToolResult = event.data.data;
    }
    if (event.data.type === "WALLET_EXTENSION_DETECTED") {
      window.opengovVotingToolResult = event.data.data;
    }
    if (event.data.type === "WALLET_CONNECTION_RESULT") {
      window.opengovVotingToolResult = __spreadProps(__spreadValues({}, window.opengovVotingToolResult), {
        connectionResult: event.data.data
      });
    }
    if (event.data.type === "SIGNATURE_RESULT") {
      window.opengovVotingToolResult = __spreadProps(__spreadValues({}, window.opengovVotingToolResult), {
        signatureResult: event.data.data
      });
    }
  });
  setTimeout(() => {
    try {
      chrome.runtime.sendMessage(
        { type: "VOTING_TOOL_CONTENT_SCRIPT_READY" },
        () => {
          if (chrome.runtime.lastError) {
            console.warn("Background script not available:", chrome.runtime.lastError.message);
          }
        }
      );
    } catch (error) {
      console.error("❌ Error testing background script connection:", error);
    }
  }, 500);
  setTimeout(() => {
    window.postMessage({
      type: "CHECK_WALLET_EXTENSION"
    }, "*");
  }, 1e3);
  function ensureInitialization() {
    if (document.readyState === "complete") {
      initializeExtension();
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(initializeExtension, 500);
      });
    } else {
      setTimeout(initializeExtension, 500);
    }
    window.addEventListener("load", () => {
      setTimeout(() => {
        if (!contentInjector) {
          initializeExtension();
        }
      }, 1e3);
    });
    setTimeout(() => {
      if (!contentInjector) {
        initializeExtension();
      }
    }, 3e3);
  }
  ensureInitialization();
  window.addEventListener("beforeunload", () => {
    if (contentInjector) {
      contentInjector.cleanup();
    }
  });
})();
