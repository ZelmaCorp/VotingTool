var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
(function() {
  "use strict";
  var _bridge, _createWasm, _heap, _wbg, _cachegetInt32, _cachegetUint8, _heapNext, _wasm, _wasmError, _wasmPromise, _type;
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = "\n.wallet-connect[data-v-4f7ca26e] {\n  min-width: 400px;\n  max-width: 500px;\n}\n.connect-header[data-v-4f7ca26e] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n  padding-bottom: 16px;\n  border-bottom: 1px solid #e1e5e9;\n}\n.connect-header h3[data-v-4f7ca26e] {\n  margin: 0;\n  color: #333;\n  font-size: 18px;\n}\n.close-btn[data-v-4f7ca26e] {\n  background: none;\n  border: none;\n  font-size: 20px;\n  cursor: pointer;\n  color: #666;\n  padding: 4px;\n  border-radius: 4px;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-4f7ca26e]:hover {\n  background-color: #f0f0f0;\n}\n.step-content[data-v-4f7ca26e] {\n  margin-bottom: 24px;\n}\n.step-description[data-v-4f7ca26e] {\n  color: #666;\n  margin-bottom: 20px;\n  text-align: center;\n}\n.wallet-options[data-v-4f7ca26e] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.wallet-list[data-v-4f7ca26e] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.wallet-option[data-v-4f7ca26e] {\n  display: flex;\n  align-items: center;\n  padding: 16px;\n  border: 2px solid #e1e5e9;\n  border-radius: 8px;\n  background: white;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  position: relative;\n}\n.wallet-option[data-v-4f7ca26e]:hover:not(:disabled) {\n  border-color: #e6007a;\n  box-shadow: 0 2px 8px rgba(230, 0, 122, 0.1);\n}\n.wallet-option[data-v-4f7ca26e]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.wallet-icon[data-v-4f7ca26e] {\n  width: 32px;\n  height: 32px;\n  margin-right: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.wallet-icon img[data-v-4f7ca26e] {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.wallet-icon-fallback[data-v-4f7ca26e] {\n  font-size: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.wallet-info[data-v-4f7ca26e] {\n  flex: 1;\n}\n.wallet-name[data-v-4f7ca26e] {\n  font-weight: 600;\n  color: #333;\n  margin-bottom: 4px;\n}\n.wallet-description[data-v-4f7ca26e] {\n  font-size: 14px;\n  color: #666;\n}\n.loading-spinner[data-v-4f7ca26e] {\n  width: 20px;\n  height: 20px;\n  border: 2px solid #f3f3f3;\n  border-top: 2px solid #e6007a;\n  border-radius: 50%;\n  animation: spin-4f7ca26e 1s linear infinite;\n}\n@keyframes spin-4f7ca26e {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.extension-status[data-v-4f7ca26e] {\n  text-align: center;\n  padding: 16px;\n  border-radius: 8px;\n  background: #f8f9fa;\n  border: 1px solid #e1e5e9;\n}\n.status-checking[data-v-4f7ca26e] {\n  color: #0066cc;\n  font-weight: 500;\n}\n.status-not-found[data-v-4f7ca26e] {\n  color: #dc3545;\n  font-weight: 500;\n}\n.status-found[data-v-4f7ca26e] {\n  color: #28a745;\n  font-weight: 500;\n}\n.status-help[data-v-4f7ca26e] {\n  margin-top: 8px;\n  font-size: 14px;\n  color: #666;\n}\n.status-help a[data-v-4f7ca26e] {\n  color: #e6007a;\n  text-decoration: none;\n  font-weight: 500;\n}\n.status-help a[data-v-4f7ca26e]:hover {\n  text-decoration: underline;\n}\n.status-actions[data-v-4f7ca26e] {\n  display: flex;\n  gap: 12px;\n  margin-top: 16px;\n}\n.account-list[data-v-4f7ca26e] {\n  max-height: 300px;\n  overflow-y: auto;\n  border: 1px solid #e1e5e9;\n  border-radius: 8px;\n}\n.account-item[data-v-4f7ca26e] {\n  display: flex;\n  align-items: center;\n  padding: 16px;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  border-bottom: 1px solid #f0f0f0;\n}\n.account-item[data-v-4f7ca26e]:last-child {\n  border-bottom: none;\n}\n.account-item[data-v-4f7ca26e]:hover {\n  background-color: #f8f9fa;\n}\n.account-item.selected[data-v-4f7ca26e] {\n  background-color: #e8f4fd;\n  border-left: 3px solid #e6007a;\n}\n.account-avatar[data-v-4f7ca26e] {\n  width: 32px;\n  height: 32px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 12px;\n  margin-right: 12px;\n}\n.account-info[data-v-4f7ca26e] {\n  flex: 1;\n}\n.account-name[data-v-4f7ca26e] {\n  font-weight: 500;\n  color: #333;\n  margin-bottom: 2px;\n}\n.account-address[data-v-4f7ca26e] {\n  font-family: monospace;\n  font-size: 12px;\n  color: #666;\n}\n.account-check[data-v-4f7ca26e] {\n  color: #e6007a;\n  font-weight: bold;\n  font-size: 18px;\n}\n.sign-message[data-v-4f7ca26e] {\n  background: #f8f9fa;\n  border: 1px solid #e1e5e9;\n  border-radius: 8px;\n  padding: 16px;\n  margin-bottom: 20px;\n}\n.message-label[data-v-4f7ca26e] {\n  font-weight: 500;\n  color: #333;\n  margin-bottom: 8px;\n}\n.message-content[data-v-4f7ca26e] {\n  font-family: monospace;\n  font-size: 12px;\n  color: #666;\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n.step-actions[data-v-4f7ca26e] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.btn-primary[data-v-4f7ca26e], .btn-secondary[data-v-4f7ca26e] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-primary[data-v-4f7ca26e] {\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n}\n.btn-primary[data-v-4f7ca26e]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-primary[data-v-4f7ca26e]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-secondary[data-v-4f7ca26e] {\n  background: #6c757d;\n  color: white;\n}\n.btn-secondary[data-v-4f7ca26e]:hover {\n  background: #5a6268;\n}\n.error-message[data-v-4f7ca26e] {\n  text-align: left;\n  padding: 24px;\n  background: #fff5f5;\n  border: 1px solid #fed7d7;\n  border-radius: 8px;\n}\n.error-icon[data-v-4f7ca26e] {\n  font-size: 24px;\n  margin-bottom: 8px;\n  display: block;\n}\n.error-text[data-v-4f7ca26e] {\n  color: #c53030;\n  font-weight: 500;\n  white-space: pre-line;\n  line-height: 1.5;\n  margin-bottom: 16px;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n}\n.error-actions[data-v-4f7ca26e] {\n  display: flex;\n  justify-content: center;\n}\n.no-wallets[data-v-4f7ca26e] {\n  text-align: center;\n  padding: 24px;\n  color: #666;\n}\n.no-wallets-icon[data-v-4f7ca26e] {\n  font-size: 32px;\n  margin-bottom: 8px;\n}\n.no-wallets-text[data-v-4f7ca26e] {\n  font-size: 14px;\n}\n\n.modal-overlay[data-v-973fd79d] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.config-modal[data-v-973fd79d] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 90vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-973fd79d] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-973fd79d] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-973fd79d] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-973fd79d]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-973fd79d] {\n  padding: 24px;\n  flex: 1;\n  overflow-y: auto;\n}\n.config-sections[data-v-973fd79d] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.config-section[data-v-973fd79d] {\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  padding: 20px;\n}\n.config-section h4[data-v-973fd79d] {\n  margin: 0 0 16px 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #333;\n  border-bottom: 2px solid #e6007a;\n  padding-bottom: 8px;\n}\n.form-group[data-v-973fd79d] {\n  margin-bottom: 16px;\n}\n.form-group label[data-v-973fd79d] {\n  display: block;\n  margin-bottom: 6px;\n  font-weight: 500;\n  color: #555;\n}\n.form-input[data-v-973fd79d] {\n  width: 100%;\n  padding: 10px 12px;\n  border: 2px solid #e9ecef;\n  border-radius: 6px;\n  font-size: 14px;\n  transition: border-color 0.2s ease;\n}\n.form-input[data-v-973fd79d]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.number-input[data-v-973fd79d] {\n  max-width: 120px;\n}\n.input-help[data-v-973fd79d] {\n  margin-top: 6px;\n  font-size: 12px;\n  color: #666;\n  line-height: 1.4;\n}\n.agreement-preview[data-v-973fd79d] {\n  margin-top: 16px;\n  padding: 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n}\n.preview-label[data-v-973fd79d] {\n  font-size: 12px;\n  font-weight: 500;\n  color: #666;\n  margin-bottom: 8px;\n}\n.preview-bar[data-v-973fd79d] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.progress-bar[data-v-973fd79d] {\n  width: 100%;\n  height: 8px;\n  background: #e9ecef;\n  border-radius: 4px;\n  overflow: hidden;\n}\n.progress-fill[data-v-973fd79d] {\n  height: 100%;\n  background: linear-gradient(135deg, #28a745, #20c997);\n  transition: width 0.3s ease;\n}\n.progress-text[data-v-973fd79d] {\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n}\n.modal-actions[data-v-973fd79d] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-973fd79d] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-secondary[data-v-973fd79d] {\n  background: #f8f9fa;\n  color: #666;\n  border: 1px solid #dee2e6;\n}\n.btn-secondary[data-v-973fd79d]:hover {\n  background: #e9ecef;\n}\n.btn-primary[data-v-973fd79d] {\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n}\n.btn-primary[data-v-973fd79d]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #cc1177);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn[data-v-973fd79d]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.status-badge-container[data-v-875347a1] {\n  position: relative;\n  display: inline-block;\n}\n.status-badge[data-v-875347a1] {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  border: 1px solid rgba(255, 255, 255, 0.6);\n  transition: all 0.2s ease;\n  user-select: none;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);\n  backdrop-filter: blur(3px);\n  white-space: nowrap;\n  min-width: 80px;\n  justify-content: center;\n}\n.status-clickable[data-v-875347a1] {\n  cursor: pointer;\n}\n.status-clickable[data-v-875347a1]:hover {\n  transform: translateY(-2px) scale(1.02);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n  border-color: rgba(255, 255, 255, 1);\n}\n.status-icon[data-v-875347a1] {\n  font-size: 0.8rem;\n}\n.edit-icon[data-v-875347a1] {\n  font-size: 0.7rem;\n  opacity: 0.7;\n}\n\n/* Status color classes with enhanced floating design */\n.status-not-started[data-v-875347a1] { \n  background: linear-gradient(135deg, #6c757d, #5a6268); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-considering[data-v-875347a1] { \n  background: linear-gradient(135deg, #ffc107, #e0a800); \n  color: #212529; \n  border-color: rgba(33, 37, 41, 0.2);\n}\n.status-ready-for-approval[data-v-875347a1] { \n  background: linear-gradient(135deg, #17a2b8, #138496); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-waiting-for-agreement[data-v-875347a1] { \n  background: linear-gradient(135deg, #fd7e14, #e8680b); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-ready-to-vote[data-v-875347a1] { \n  background: linear-gradient(135deg, #28a745, #1e7e34); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-reconsidering[data-v-875347a1] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-voted-aye[data-v-875347a1] { \n  background: linear-gradient(135deg, #198754, #155724); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-voted-nay[data-v-875347a1] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-voted-abstain[data-v-875347a1] { \n  background: linear-gradient(135deg, #6f42c1, #5a32a3); \n  color: white; \n  border-color: rgba(255, 255, 255, 0.3);\n}\n.status-not-voted[data-v-875347a1] { \n  background: linear-gradient(135deg, #e9ecef, #dee2e6); \n  color: #495057; \n  border-color: rgba(73, 80, 87, 0.2);\n}\n\n/* Modal styles */\n.modal-overlay[data-v-875347a1] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.status-modal[data-v-875347a1] {\n  background: white;\n  border-radius: 8px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-875347a1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e9ecef;\n}\n.modal-header h3[data-v-875347a1] {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n}\n.close-btn[data-v-875347a1] {\n  background: none;\n  border: none;\n  font-size: 1.5rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 30px;\n  height: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn[data-v-875347a1]:hover {\n  color: #495057;\n}\n.modal-content[data-v-875347a1] {\n  padding: 20px;\n}\n.modal-content p[data-v-875347a1] {\n  margin: 0 0 16px 0;\n  font-size: 0.9rem;\n}\n.status-options[data-v-875347a1] {\n  margin: 20px 0;\n}\n.status-options label[data-v-875347a1] {\n  display: block;\n  margin-bottom: 12px;\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.status-grid[data-v-875347a1] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 8px;\n}\n.status-option[data-v-875347a1] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 12px;\n  border: 2px solid #e9ecef;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  font-size: 0.8rem;\n}\n.status-option[data-v-875347a1]:hover {\n  border-color: #007bff;\n  background: #f8f9fa;\n}\n.status-option.selected[data-v-875347a1] {\n  border-color: #007bff;\n  background: #e7f3ff;\n}\n.option-icon[data-v-875347a1] {\n  font-size: 0.9rem;\n}\n.reason-section[data-v-875347a1] {\n  margin: 20px 0;\n}\n.reason-section label[data-v-875347a1] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.reason-section textarea[data-v-875347a1] {\n  width: 100%;\n  border: 1px solid #ced4da;\n  border-radius: 4px;\n  padding: 8px 12px;\n  font-size: 0.9rem;\n  resize: vertical;\n  min-height: 60px;\n}\n.reason-section textarea[data-v-875347a1]:focus {\n  outline: none;\n  border-color: #007bff;\n  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n.modal-actions[data-v-875347a1] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-875347a1] {\n  padding: 8px 16px;\n  border-radius: 4px;\n  border: none;\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-secondary[data-v-875347a1] {\n  background: #6c757d;\n  color: white;\n}\n.btn-secondary[data-v-875347a1]:hover {\n  background: #5a6268;\n}\n.btn-primary[data-v-875347a1] {\n  background: #007bff;\n  color: white;\n}\n.btn-primary[data-v-875347a1]:hover:not(:disabled) {\n  background: #0056b3;\n}\n.btn-primary[data-v-875347a1]:disabled {\n  background: #6c757d;\n  cursor: not-allowed;\n}\n\n.modal-overlay[data-v-05d5a52c] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.proposal-browser-modal[data-v-05d5a52c] {\n  background: white;\n  border-radius: 12px;\n  width: 95vw;\n  height: 90vh;\n  max-width: 1400px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n}\n.modal-header[data-v-05d5a52c] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: #f8f9fa;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h2[data-v-05d5a52c] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-05d5a52c] {\n  background: none;\n  border: none;\n  font-size: 2rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: all 0.2s ease;\n}\n.close-btn[data-v-05d5a52c]:hover {\n  background: #e9ecef;\n  color: #495057;\n}\n.browser-content[data-v-05d5a52c] {\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n}\n.filter-panel[data-v-05d5a52c] {\n  width: 280px;\n  background: #f8f9fa;\n  border-right: 1px solid #e9ecef;\n  padding: 20px;\n  overflow-y: auto;\n}\n.filter-section h3[data-v-05d5a52c] {\n  margin: 0 0 16px 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #333;\n}\n.filter-group[data-v-05d5a52c] {\n  margin-bottom: 16px;\n}\n.filter-group label[data-v-05d5a52c] {\n  display: block;\n  margin-bottom: 6px;\n  font-weight: 500;\n  font-size: 0.9rem;\n  color: #555;\n}\n.search-input[data-v-05d5a52c],\n.filter-select[data-v-05d5a52c] {\n  width: 100%;\n  padding: 8px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  background: white;\n}\n.search-input[data-v-05d5a52c]:focus,\n.filter-select[data-v-05d5a52c]:focus {\n  outline: none;\n  border-color: #007bff;\n  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n.clear-filters-btn[data-v-05d5a52c] {\n  width: 100%;\n  padding: 8px 16px;\n  background: #dc3545;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n.clear-filters-btn[data-v-05d5a52c]:hover {\n  background: #c82333;\n}\n.content-area[data-v-05d5a52c] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.view-controls[data-v-05d5a52c] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e9ecef;\n  background: white;\n}\n.view-modes[data-v-05d5a52c] {\n  display: flex;\n  gap: 8px;\n}\n.view-btn[data-v-05d5a52c] {\n  padding: 6px 12px;\n  border: 1px solid #ced4da;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.2s ease;\n}\n.view-btn.active[data-v-05d5a52c] {\n  background: #007bff;\n  color: white;\n  border-color: #007bff;\n}\n.sort-controls[data-v-05d5a52c] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.sort-select[data-v-05d5a52c] {\n  padding: 6px 10px;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  font-size: 0.9rem;\n}\n.sort-order-btn[data-v-05d5a52c] {\n  padding: 6px 10px;\n  border: 1px solid #ced4da;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n}\n.results-info[data-v-05d5a52c] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.proposals-container[data-v-05d5a52c] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 20px;\n}\n.loading-state[data-v-05d5a52c],\n.empty-state[data-v-05d5a52c] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 300px;\n  text-align: center;\n}\n.spinner[data-v-05d5a52c] {\n  width: 40px;\n  height: 40px;\n  border: 4px solid #f3f3f3;\n  border-top: 4px solid #007bff;\n  border-radius: 50%;\n  animation: spin-05d5a52c 1s linear infinite;\n}\n@keyframes spin-05d5a52c {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.empty-icon[data-v-05d5a52c] {\n  font-size: 4rem;\n  margin-bottom: 16px;\n}\n.proposals-list[data-v-05d5a52c] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  background: #e9ecef;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.proposal-item[data-v-05d5a52c] {\n  display: grid;\n  grid-template-columns: 80px 1fr 200px 150px 120px;\n  gap: 16px;\n  padding: 16px 20px;\n  background: white;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  align-items: center;\n}\n.proposal-item[data-v-05d5a52c]:hover {\n  background: #f8f9fa;\n}\n.proposal-id[data-v-05d5a52c] {\n  font-weight: 600;\n  color: #007bff;\n}\n.proposal-title[data-v-05d5a52c] {\n  font-weight: 500;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.proposal-assignment[data-v-05d5a52c] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: #666;\n}\n.assign-btn[data-v-05d5a52c] {\n  padding: 4px 8px;\n  background: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  font-size: 0.8rem;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n.assign-btn[data-v-05d5a52c]:hover {\n  background: #0056b3;\n}\n.proposal-updated[data-v-05d5a52c] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.proposals-cards[data-v-05d5a52c] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 20px;\n}\n.proposal-card[data-v-05d5a52c] {\n  background: white;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  padding: 20px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-card[data-v-05d5a52c]:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n  transform: translateY(-2px);\n}\n.card-header[data-v-05d5a52c] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.card-title[data-v-05d5a52c] {\n  margin: 0 0 12px 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #333;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.card-meta[data-v-05d5a52c] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.meta-item[data-v-05d5a52c] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.pagination[data-v-05d5a52c] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n  margin-top: 20px;\n  padding: 20px;\n}\n.page-btn[data-v-05d5a52c] {\n  padding: 8px 16px;\n  border: 1px solid #ced4da;\n  background: white;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.page-btn[data-v-05d5a52c]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.page-btn[data-v-05d5a52c]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.page-info[data-v-05d5a52c] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.modal-content[data-v-05d5a52c] {\n  max-height: 80vh;\n  overflow-y: auto;\n  padding: 20px;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n.proposal-list[data-v-05d5a52c] {\n  overflow-y: auto;\n  max-height: calc(80vh - 180px); /* Account for header, filters, and padding */\n  padding-right: 16px; /* Space for scrollbar */\n}\n\n/* Scrollbar styling */\n[data-v-05d5a52c]::-webkit-scrollbar {\n  width: 8px;\n}\n[data-v-05d5a52c]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 4px;\n}\n[data-v-05d5a52c]::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 4px;\n}\n[data-v-05d5a52c]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n/* Firefox scrollbar */\n[data-v-05d5a52c] {\n  scrollbar-width: thin;\n  scrollbar-color: #888 #f1f1f1;\n}\n\n.modal-overlay[data-v-4961dea0] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.dashboard-modal[data-v-4961dea0] {\n  background: white;\n  border-radius: 12px;\n  width: 90vw;\n  height: 85vh;\n  max-width: 1200px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n}\n.modal-header[data-v-4961dea0] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: #f8f9fa;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h2[data-v-4961dea0] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-4961dea0] {\n  background: none;\n  border: none;\n  font-size: 2rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: all 0.2s ease;\n}\n.close-btn[data-v-4961dea0]:hover {\n  background: #e9ecef;\n  color: #495057;\n}\n.dashboard-content[data-v-4961dea0] {\n  flex: 1;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.stats-section[data-v-4961dea0] {\n  margin-bottom: 1rem;\n}\n.stats-section-container[data-v-4961dea0] {\n  margin: 16px;\n  display: flex;\n  gap: 1rem;\n}\n.stat-card[data-v-4961dea0] {\n  flex: 1;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  border: 2px solid transparent;\n  min-width: 150px;\n}\n.stat-card[data-v-4961dea0]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.15);\n}\n.stat-card.active[data-v-4961dea0] {\n  border-color: #6b46c1;\n  background: #f8f4ff;\n}\n.stat-number[data-v-4961dea0] {\n  font-size: 2.5rem;\n  font-weight: bold;\n  color: #2d3748;\n  margin-bottom: 0.5rem;\n}\n.stat-label[data-v-4961dea0] {\n  font-size: 1rem;\n  color: #4a5568;\n  margin-bottom: 0.5rem;\n}\n.content-section[data-v-4961dea0] {\n  padding: 0 16px;\n}\n.content-area[data-v-4961dea0] {\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  height: calc(100vh - 250px);\n  overflow-y: auto;\n}\n.proposals-list[data-v-4961dea0] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.proposal-item[data-v-4961dea0] {\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 1rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-item[data-v-4961dea0]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.proposal-header[data-v-4961dea0] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.proposal-id[data-v-4961dea0] {\n  font-size: 0.875rem;\n  color: #6b46c1;\n  font-weight: 600;\n}\n.proposal-title[data-v-4961dea0] {\n  margin: 0.5rem 0;\n  font-size: 1rem;\n  color: #2d3748;\n}\n.proposal-meta[data-v-4961dea0] {\n  display: flex;\n  gap: 1rem;\n  font-size: 0.875rem;\n  color: #718096;\n}\n.meta-item[data-v-4961dea0] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.action-required[data-v-4961dea0] {\n  margin-top: 0.5rem;\n}\n.action-badge[data-v-4961dea0] {\n  background: #fed7d7;\n  color: #c53030;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.empty-state[data-v-4961dea0] {\n  text-align: center;\n  padding: 2rem;\n  color: #718096;\n}\n.empty-icon[data-v-4961dea0] {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n.activity-summary[data-v-4961dea0] {\n  margin-bottom: 2rem;\n}\n.activity-stats[data-v-4961dea0] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.activity-stat[data-v-4961dea0] {\n  background: #f7fafc;\n  padding: 1rem;\n  border-radius: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.stat-value[data-v-4961dea0] {\n  font-weight: 600;\n  color: #2d3748;\n}\n.recent-actions[data-v-4961dea0] {\n  margin-top: 2rem;\n}\n.activity-list[data-v-4961dea0] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.activity-item[data-v-4961dea0] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 0.75rem;\n  background: #f7fafc;\n  border-radius: 8px;\n}\n.activity-icon[data-v-4961dea0] {\n  font-size: 1.25rem;\n}\n.activity-details[data-v-4961dea0] {\n  flex: 1;\n}\n.activity-description[data-v-4961dea0] {\n  font-size: 0.875rem;\n  color: #2d3748;\n}\n.activity-time[data-v-4961dea0] {\n  font-size: 0.75rem;\n  color: #718096;\n  margin-top: 0.25rem;\n}\n.urgent[data-v-4961dea0] {\n  border-left: 4px solid #e53e3e;\n}\n.evaluation-info[data-v-4961dea0] {\n  margin: 0.5rem 0;\n  padding: 0.5rem;\n  background: #f7fafc;\n  border-radius: 4px;\n}\n.suggested-vote[data-v-4961dea0] {\n  font-weight: 600;\n  color: #2d3748;\n}\n.vote-reason[data-v-4961dea0] {\n  margin-top: 0.25rem;\n  font-size: 0.875rem;\n  color: #718096;\n}\n\n.modal-overlay[data-v-cafa1a99] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-cafa1a99] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  width: 400px;\n  max-width: 90vw;\n}\n.modal-header[data-v-cafa1a99] {\n  padding: 20px 24px 0;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.icon[data-v-cafa1a99] {\n  font-size: 24px;\n}\n.icon-success[data-v-cafa1a99] { color: #28a745;\n}\n.icon-error[data-v-cafa1a99] { color: #dc3545;\n}\n.icon-warning[data-v-cafa1a99] { color: #ffc107;\n}\n.icon-info[data-v-cafa1a99] { color: #007bff;\n}\n.modal-header h3[data-v-cafa1a99] {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: #333;\n}\n.modal-body[data-v-cafa1a99] {\n  padding: 16px 24px 20px;\n}\n.modal-body p[data-v-cafa1a99] {\n  margin: 0;\n  color: #666;\n  line-height: 1.5;\n}\n.modal-actions[data-v-cafa1a99] {\n  padding: 0 24px 24px;\n  display: flex;\n  justify-content: flex-end;\n}\n.ok-btn[data-v-cafa1a99] {\n  padding: 8px 24px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  color: white;\n}\n.ok-btn.success[data-v-cafa1a99] {\n  background: #28a745;\n  border-color: #28a745;\n}\n.ok-btn.success[data-v-cafa1a99]:hover {\n  background: #218838;\n  border-color: #218838;\n}\n.ok-btn.error[data-v-cafa1a99] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.ok-btn.error[data-v-cafa1a99]:hover {\n  background: #c82333;\n  border-color: #c82333;\n}\n.ok-btn.warning[data-v-cafa1a99] {\n  background: #ffc107;\n  border-color: #ffc107;\n  color: #212529;\n}\n.ok-btn.warning[data-v-cafa1a99]:hover {\n  background: #e0a800;\n  border-color: #e0a800;\n}\n.ok-btn.info[data-v-cafa1a99] {\n  background: #007bff;\n  border-color: #007bff;\n}\n.ok-btn.info[data-v-cafa1a99]:hover {\n  background: #0056b3;\n  border-color: #0056b3;\n}\n\n.modal-overlay[data-v-303a7545] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.team-workflow-modal[data-v-303a7545] {\n  background: white;\n  border-radius: 12px;\n  width: 90vw;\n  height: 85vh;\n  max-width: 1200px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n}\n.modal-header[data-v-303a7545] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: #f8f9fa;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h2[data-v-303a7545] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-303a7545] {\n  background: none;\n  border: none;\n  font-size: 2rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: all 0.2s ease;\n}\n.close-btn[data-v-303a7545]:hover {\n  background: #e9ecef;\n  color: #495057;\n}\n.workflow-content[data-v-303a7545] {\n  flex: 1;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.stats-section[data-v-303a7545] {\n  margin-bottom: 1rem;\n}\n.stats-section-container[data-v-303a7545] {\n  margin: 16px;\n  display: flex;\n  gap: 1rem;\n}\n.stat-card[data-v-303a7545] {\n  flex: 1;\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  border: 2px solid transparent;\n  min-width: 150px;\n}\n.stat-card[data-v-303a7545]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.15);\n}\n.stat-card.active[data-v-303a7545] {\n  border-color: #6b46c1;\n  background: #f8f4ff;\n}\n.stat-number[data-v-303a7545] {\n  font-size: 2.5rem;\n  font-weight: bold;\n  color: #2d3748;\n  margin-bottom: 0.5rem;\n}\n.stat-label[data-v-303a7545] {\n  font-size: 1rem;\n  color: #4a5568;\n  margin-bottom: 0.5rem;\n}\n.stat-icon[data-v-303a7545] {\n  font-size: 1.5rem;\n  position: absolute;\n  top: 1rem;\n  right: 1rem;\n}\n.stat-subtitle[data-v-303a7545] {\n  font-size: 0.875rem;\n  color: #6b46c1;\n  margin-top: 0.5rem;\n}\n.content-section[data-v-303a7545] {\n  padding: 0 16px;\n}\n.content-area[data-v-303a7545] {\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  height: calc(100vh - 250px);\n  overflow-y: auto;\n}\nh3[data-v-303a7545] {\n  margin-top: 0;\n  color: #2d3748;\n  font-size: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.tabs-section[data-v-303a7545] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.tab-buttons[data-v-303a7545] {\n  display: flex;\n  border-bottom: 1px solid #e9ecef;\n  background: white;\n}\n.tab-btn[data-v-303a7545] {\n  padding: 16px 20px;\n  border: none;\n  background: none;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #666;\n  border-bottom: 3px solid transparent;\n  transition: all 0.2s ease;\n  flex: 1;\n  text-align: center;\n}\n.tab-btn.active[data-v-303a7545] {\n  color: #007bff;\n  border-bottom-color: #007bff;\n  background: #f8f9fa;\n}\n.tab-btn[data-v-303a7545]:hover:not(.active) {\n  background: #f8f9fa;\n  color: #333;\n}\n.tab-content[data-v-303a7545] {\n  flex: 1;\n  overflow: hidden;\n}\n.tab-panel[data-v-303a7545] {\n  height: 100%;\n  overflow-y: auto;\n  padding: 20px 24px;\n}\n.panel-header[data-v-303a7545] {\n  margin-bottom: 24px;\n}\n.panel-header h3[data-v-303a7545] {\n  margin: 0 0 8px 0;\n  color: #333;\n  font-size: 1.2rem;\n}\n.panel-header p[data-v-303a7545] {\n  margin: 0;\n  color: #666;\n  font-size: 0.9rem;\n}\n.empty-state[data-v-303a7545] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 200px;\n  text-align: center;\n}\n.empty-icon[data-v-303a7545] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n}\n.empty-state h3[data-v-303a7545] {\n  margin: 0 0 8px 0;\n  color: #333;\n}\n.empty-state p[data-v-303a7545] {\n  margin: 0;\n  color: #666;\n}\n.proposals-list[data-v-303a7545] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.proposal-item[data-v-303a7545] {\n  background: white;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  padding: 24px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.proposal-item[data-v-303a7545]:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n  transform: translateY(-2px);\n}\n.agreement-item[data-v-303a7545] {\n  border-left: 4px solid #ffc107;\n}\n.ready-item[data-v-303a7545] {\n  border-left: 4px solid #28a745;\n}\n.discussion-item[data-v-303a7545] {\n  border-left: 4px solid #17a2b8;\n}\n.vetoed-item[data-v-303a7545] {\n  border-left: 4px solid #dc3545;\n}\n.proposal-header[data-v-303a7545] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.proposal-id[data-v-303a7545] {\n  font-weight: 600;\n  color: #007bff;\n}\n.proposal-title[data-v-303a7545] {\n  margin: 0 0 16px 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #333;\n}\n.agreement-progress[data-v-303a7545] {\n  margin: 16px 0;\n  padding: 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n}\n.progress-header[data-v-303a7545] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.progress-count[data-v-303a7545] {\n  color: #007bff;\n  font-weight: 600;\n}\n.progress-bar[data-v-303a7545] {\n  height: 8px;\n  background: #e9ecef;\n  border-radius: 4px;\n  overflow: hidden;\n  position: relative;\n}\n.progress-fill[data-v-303a7545] {\n  height: 100%;\n  transition: width 0.3s ease, background-color 0.3s ease;\n  border-radius: 4px;\n}\n.team-status[data-v-303a7545] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 20px;\n  margin: 16px 0;\n}\n.status-section h5[data-v-303a7545] {\n  margin: 0 0 8px 0;\n  font-size: 0.9rem;\n  font-weight: 600;\n  color: #333;\n}\n.member-list[data-v-303a7545] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.member-badge[data-v-303a7545] {\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.member-badge.agreed[data-v-303a7545] {\n  background: #d4edda;\n  color: #155724;\n}\n.member-badge.pending[data-v-303a7545] {\n  background: #fff3cd;\n  color: #856404;\n}\n.member-badge.discussion[data-v-303a7545] {\n  background: #d1ecf1;\n  color: #0c5460;\n}\n.member-badge.vetoed[data-v-303a7545] {\n  background: #f8d7da;\n  color: #721c24;\n}\n.no-members[data-v-303a7545] {\n  color: #666;\n  font-style: italic;\n  font-size: 0.9rem;\n}\n.voting-info[data-v-303a7545],\n.discussion-info[data-v-303a7545],\n.veto-info[data-v-303a7545] {\n  margin: 16px 0;\n  padding: 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n}\n.vote-recommendation[data-v-303a7545] {\n  margin-bottom: 8px;\n}\n.vote-badge[data-v-303a7545] {\n  padding: 4px 8px;\n  background: #007bff;\n  color: white;\n  border-radius: 4px;\n  font-size: 0.8rem;\n  margin-left: 8px;\n}\n.vote-reason[data-v-303a7545] {\n  font-size: 0.9rem;\n  color: #666;\n}\n.veto-alert[data-v-303a7545] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #721c24;\n}\n.alert-icon[data-v-303a7545] {\n  font-size: 1.2rem;\n}\n.proposal-meta[data-v-303a7545] {\n  display: flex;\n  gap: 20px;\n  font-size: 0.9rem;\n  color: #666;\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.meta-item[data-v-303a7545] {\n  display: flex;\n  gap: 4px;\n}\n.modal-content[data-v-303a7545] {\n  max-height: 80vh;\n  overflow-y: auto;\n  padding: 20px;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n.workflow-section[data-v-303a7545] {\n  margin-bottom: 24px;\n  overflow-y: auto;\n  max-height: calc(80vh - 120px); /* Account for header and padding */\n}\n\n/* Scrollbar styling */\n[data-v-303a7545]::-webkit-scrollbar {\n  width: 8px;\n}\n[data-v-303a7545]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 4px;\n}\n[data-v-303a7545]::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 4px;\n}\n[data-v-303a7545]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n/* Firefox scrollbar */\n[data-v-303a7545] {\n  scrollbar-width: thin;\n  scrollbar-color: #888 #f1f1f1;\n}\n.loading-state[data-v-303a7545],\n.error-state[data-v-303a7545] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 300px;\n  text-align: center;\n}\n.loading-spinner[data-v-303a7545] {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #f3f3f3;\n  border-top: 3px solid #007bff;\n  border-radius: 50%;\n  animation: spin-303a7545 1s linear infinite;\n  margin-bottom: 16px;\n}\n@keyframes spin-303a7545 {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.error-icon[data-v-303a7545] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n  color: #dc3545;\n}\n.error-state h3[data-v-303a7545] {\n  margin: 0 0 8px 0;\n  color: #dc3545;\n}\n.error-state p[data-v-303a7545] {\n  margin: 0 0 16px 0;\n  color: #666;\n}\n.retry-btn[data-v-303a7545] {\n  padding: 8px 16px;\n  background: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: background-color 0.2s ease;\n}\n.retry-btn[data-v-303a7545]:hover {\n  background: #0056b3;\n}\n.send-to-mimir-btn[data-v-303a7545] {\n  background: #e6007a;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  padding: 8px 16px;\n  font-size: 14px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 120px;\n  margin-top: 12px;\n  transition: background 0.3s, opacity 0.3s;\n}\n.send-to-mimir-btn[data-v-303a7545]:hover:not(:disabled) {\n  background: #c40069;\n}\n.send-to-mimir-btn[data-v-303a7545]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.loading-spinner[data-v-303a7545] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid #ffffff;\n  border-top: 2px solid transparent;\n  border-radius: 50%;\n  animation: spin-303a7545 1s linear infinite;\n}\n@keyframes spin-303a7545 {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.veto-section[data-v-303a7545] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  padding-top: 1rem;\n  border-top: 1px solid #e2e8f0;\n}\n.veto-info[data-v-303a7545] {\n  font-size: 1rem;\n  color: #e53e3e;\n  font-weight: 500;\n}\n.veto-reason[data-v-303a7545] {\n  font-size: 1rem;\n  color: #2d3748;\n  background: #fff5f5;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  white-space: pre-wrap;\n}\n.veto-date[data-v-303a7545] {\n  font-size: 0.875rem;\n  color: #718096;\n}\n.proposal-card[data-v-303a7545] {\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  margin-bottom: 1rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.proposal-header[data-v-303a7545] {\n  margin-bottom: 1rem;\n}\n.proposal-header h4[data-v-303a7545] {\n  font-size: 1.1rem;\n  color: #2d3748;\n  margin: 0;\n}\n.proposal-details[data-v-303a7545] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.meta-section[data-v-303a7545] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid #e2e8f0;\n}\n.meta-item[data-v-303a7545] {\n  font-size: 0.875rem;\n  color: #4a5568;\n}\n.veto-section[data-v-303a7545] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  padding-top: 1rem;\n  border-top: 1px solid #e2e8f0;\n}\n.veto-info[data-v-303a7545] {\n  font-size: 1rem;\n  color: #e53e3e;\n  font-weight: 500;\n}\n.veto-reason[data-v-303a7545] {\n  font-size: 1rem;\n  color: #2d3748;\n  background: #fff5f5;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  white-space: pre-wrap;\n}\n.veto-date[data-v-303a7545] {\n  font-size: 0.875rem;\n  color: #718096;\n}\n\n.modal-overlay[data-v-f35ef754] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.settings-modal[data-v-f35ef754] {\n  background: white;\n  border-radius: 12px;\n  width: 90vw;\n  height: 85vh;\n  max-width: 1200px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n}\n.modal-header[data-v-f35ef754] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: #f8f9fa;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h2[data-v-f35ef754] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-f35ef754] {\n  background: none;\n  border: none;\n  font-size: 2rem;\n  cursor: pointer;\n  color: #6c757d;\n  padding: 0;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: all 0.2s ease;\n}\n.close-btn[data-v-f35ef754]:hover {\n  background: #e9ecef;\n  color: #495057;\n}\n.settings-content[data-v-f35ef754] {\n  flex: 1;\n  display: flex;\n  overflow: hidden;\n}\n.settings-nav[data-v-f35ef754] {\n  width: 280px;\n  background: #f8f9fa;\n  border-right: 1px solid #e9ecef;\n  padding: 20px;\n  overflow-y: auto;\n}\n.nav-section[data-v-f35ef754] {\n  margin-bottom: 24px;\n}\n.nav-section h3[data-v-f35ef754] {\n  margin: 0 0 12px 0;\n  font-size: 0.9rem;\n  font-weight: 600;\n  color: #666;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.nav-item[data-v-f35ef754] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  padding: 12px 16px;\n  border: none;\n  background: none;\n  cursor: pointer;\n  border-radius: 6px;\n  margin-bottom: 4px;\n  transition: all 0.2s ease;\n  text-align: left;\n  font-size: 0.9rem;\n  color: #333;\n}\n.nav-item[data-v-f35ef754]:hover:not(:disabled) {\n  background: #e9ecef;\n}\n.nav-item[data-v-f35ef754]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  color: #999;\n}\n.nav-item[data-v-f35ef754]:disabled:hover {\n  background: transparent;\n  color: #999;\n}\n.nav-item.active[data-v-f35ef754] {\n  background: #007bff;\n  color: white;\n}\n.nav-icon[data-v-f35ef754] {\n  margin-right: 12px;\n  font-size: 1.1rem;\n}\n.settings-main[data-v-f35ef754] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px;\n}\n.section-content[data-v-f35ef754] {\n  max-width: 800px;\n}\n.section-header[data-v-f35ef754] {\n  margin-bottom: 24px;\n}\n.section-header h3[data-v-f35ef754] {\n  margin: 0 0 8px 0;\n  font-size: 1.3rem;\n  font-weight: 600;\n  color: #333;\n}\n.section-header p[data-v-f35ef754] {\n  margin: 0;\n  color: #666;\n  font-size: 0.95rem;\n}\n.form-group[data-v-f35ef754] {\n  margin-bottom: 20px;\n}\n.form-group label[data-v-f35ef754] {\n  display: block;\n  margin-bottom: 6px;\n  font-weight: 500;\n  color: #333;\n  font-size: 0.9rem;\n}\n.form-input[data-v-f35ef754],\n.form-select[data-v-f35ef754] {\n  width: 100%;\n  padding: 10px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 6px;\n  font-size: 0.9rem;\n}\n.form-input[data-v-f35ef754]:focus,\n.form-select[data-v-f35ef754]:focus {\n  outline: none;\n  border-color: #007bff;\n  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n.form-group small[data-v-f35ef754] {\n  display: block;\n  margin-top: 4px;\n  color: #666;\n  font-size: 0.8rem;\n}\n.form-note[data-v-f35ef754] {\n  margin: 0 0 12px 0;\n  color: #666;\n  font-size: 0.9rem;\n  font-style: italic;\n}\n.checkbox-label[data-v-f35ef754] {\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n}\n.checkbox-label input[data-v-f35ef754] {\n  margin-right: 8px;\n  width: auto;\n}\n.team-members-list[data-v-f35ef754] {\n  border: 1px solid #e9ecef;\n  border-radius: 6px;\n  padding: 16px;\n}\n.member-item[data-v-f35ef754] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 12px;\n  align-items: center;\n}\n.member-name[data-v-f35ef754] {\n  flex: 1;\n  padding: 8px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 4px;\n}\n.member-address[data-v-f35ef754] {\n  flex: 2;\n  padding: 8px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 4px;\n  font-family: monospace;\n  background: #f8f9fa;\n}\n.member-info[data-v-f35ef754] {\n  font-size: 0.8rem;\n  color: #666;\n  font-style: italic;\n}\n.no-members[data-v-f35ef754] {\n  text-align: center;\n  color: #666;\n  font-style: italic;\n  padding: 20px;\n}\n.readonly-field[data-v-f35ef754] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.readonly-field input[readonly][data-v-f35ef754] {\n  background: #f8f9fa;\n  color: #6c757d;\n  cursor: not-allowed;\n  flex: 1;\n}\n.readonly-field-header[data-v-f35ef754] {\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 8px;\n}\n.multisig-badge[data-v-f35ef754] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  background: #ffc107;\n  color: #212529;\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.member-item.readonly[data-v-f35ef754] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 12px;\n  background: #f8f9fa;\n  border-radius: 6px;\n  border: 1px solid #e9ecef;\n  margin-bottom: 8px;\n}\n.member-display-name[data-v-f35ef754] {\n  font-weight: 500;\n  color: #333;\n  font-size: 0.9rem;\n}\n.member-address[data-v-f35ef754] {\n  font-family: monospace;\n  color: #6c757d;\n  font-size: 0.8rem;\n  word-break: break-all;\n}\n.empty-state[data-v-f35ef754] {\n  text-align: center;\n  padding: 40px 20px;\n  color: #6c757d;\n}\n.empty-icon[data-v-f35ef754] {\n  font-size: 2.5rem;\n  display: block;\n  margin-bottom: 12px;\n}\n.empty-state p[data-v-f35ef754] {\n  margin: 0 0 8px 0;\n  font-weight: 500;\n  color: #495057;\n}\n.empty-state small[data-v-f35ef754] {\n  color: #6c757d;\n}\n.remove-btn[data-v-f35ef754] {\n  background: #dc3545;\n  color: white;\n  border: none;\n  border-radius: 50%;\n  width: 32px;\n  height: 32px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.add-member-btn[data-v-f35ef754] {\n  background: #28a745;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.9rem;\n}\n.form-actions[data-v-f35ef754] {\n  display: flex;\n  gap: 12px;\n  margin-top: 24px;\n}\n.save-btn[data-v-f35ef754] {\n  background: #007bff;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.reset-btn[data-v-f35ef754] {\n  background: #6c757d;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.voting-stats[data-v-f35ef754] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 20px;\n  margin-bottom: 24px;\n}\n.stat-card[data-v-f35ef754] {\n  background: #f8f9fa;\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n}\n.stat-number[data-v-f35ef754] {\n  font-size: 2rem;\n  font-weight: 700;\n  color: #007bff;\n  margin-bottom: 8px;\n}\n.stat-label[data-v-f35ef754] {\n  font-size: 0.9rem;\n  color: #666;\n  font-weight: 500;\n}\n.voting-history-list[data-v-f35ef754] {\n  max-height: 400px;\n  overflow-y: auto;\n}\n.vote-item[data-v-f35ef754] {\n  background: white;\n  border: 1px solid #e9ecef;\n  border-radius: 6px;\n  padding: 16px;\n  margin-bottom: 12px;\n}\n.vote-header[data-v-f35ef754] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 8px;\n}\n.proposal-id[data-v-f35ef754] {\n  font-weight: 600;\n  color: #007bff;\n}\n.vote-badge[data-v-f35ef754] {\n  padding: 4px 8px;\n  border-radius: 4px;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.vote-badge.aye[data-v-f35ef754] {\n  background: #d4edda;\n  color: #155724;\n}\n.vote-badge.nay[data-v-f35ef754] {\n  background: #f8d7da;\n  color: #721c24;\n}\n.vote-badge.abstain[data-v-f35ef754] {\n  background: #e2e3e5;\n  color: #383d41;\n}\n.vote-title[data-v-f35ef754] {\n  font-weight: 500;\n  margin-bottom: 4px;\n}\n.vote-date[data-v-f35ef754] {\n  font-size: 0.8rem;\n  color: #666;\n}\n.sync-controls[data-v-f35ef754] {\n  background: #f8f9fa;\n  padding: 20px;\n  border-radius: 8px;\n}\n.sync-status[data-v-f35ef754] {\n  margin-bottom: 16px;\n}\n.status-item[data-v-f35ef754] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 8px;\n}\n.status-label[data-v-f35ef754] {\n  font-weight: 500;\n}\n.status-value[data-v-f35ef754] {\n  font-family: monospace;\n}\n.status-value.connected[data-v-f35ef754] {\n  color: #28a745;\n}\n.status-value.error[data-v-f35ef754] {\n  color: #dc3545;\n}\n.sync-actions[data-v-f35ef754] {\n  display: flex;\n  gap: 12px;\n}\n.sync-btn[data-v-f35ef754] {\n  background: #007bff;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.sync-btn[data-v-f35ef754]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.clear-cache-btn[data-v-f35ef754] {\n  background: #dc3545;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.coming-soon[data-v-f35ef754],\n.under-review[data-v-f35ef754] {\n  text-align: center;\n  padding: 40px 20px;\n  background: #f8f9fa;\n  border-radius: 8px;\n}\n.coming-soon-icon[data-v-f35ef754],\n.under-review-icon[data-v-f35ef754] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n}\n.coming-soon h4[data-v-f35ef754],\n.under-review h4[data-v-f35ef754] {\n  margin: 0 0 12px 0;\n  color: #333;\n}\n.coming-soon p[data-v-f35ef754],\n.under-review p[data-v-f35ef754] {\n  margin: 0 0 16px 0;\n  color: #666;\n}\n.coming-soon ul[data-v-f35ef754] {\n  text-align: left;\n  max-width: 300px;\n  margin: 0 auto;\n}\n.temp-actions[data-v-f35ef754] {\n  margin-top: 20px;\n}\n.refresh-btn[data-v-f35ef754] {\n  background: #007bff;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.refresh-btn[data-v-f35ef754]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.help-content[data-v-f35ef754],\n.about-content[data-v-f35ef754] {\n  max-width: 600px;\n}\n.help-section[data-v-f35ef754],\n.about-section[data-v-f35ef754] {\n  margin-bottom: 24px;\n}\n.help-section h4[data-v-f35ef754],\n.about-section h4[data-v-f35ef754] {\n  margin: 0 0 12px 0;\n  color: #333;\n  font-size: 1.1rem;\n}\n.help-section ul[data-v-f35ef754],\n.help-section ol[data-v-f35ef754],\n.about-section ul[data-v-f35ef754] {\n  margin: 0;\n  padding-left: 20px;\n}\n.help-section li[data-v-f35ef754],\n.about-section li[data-v-f35ef754] {\n  margin-bottom: 8px;\n  line-height: 1.5;\n}\n.help-links[data-v-f35ef754],\n.about-links[data-v-f35ef754] {\n  display: flex;\n  gap: 16px;\n  margin-top: 24px;\n}\n.help-link[data-v-f35ef754],\n.about-link[data-v-f35ef754] {\n  display: inline-flex;\n  align-items: center;\n  padding: 10px 16px;\n  background: #007bff;\n  color: white;\n  text-decoration: none;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: background-color 0.2s ease;\n}\n.help-link[data-v-f35ef754]:hover,\n.about-link[data-v-f35ef754]:hover {\n  background: #0056b3;\n}\n.empty-state[data-v-f35ef754] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 200px;\n  text-align: center;\n}\n.empty-icon[data-v-f35ef754] {\n  font-size: 3rem;\n  margin-bottom: 16px;\n}\n.empty-state h4[data-v-f35ef754] {\n  margin: 0 0 8px 0;\n  color: #333;\n}\n.empty-state p[data-v-f35ef754] {\n  margin: 0;\n  color: #666;\n}\n.activity-list[data-v-f35ef754] {\n  max-height: 400px;\n  overflow-y: auto;\n}\n.activity-item[data-v-f35ef754] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  background: #f8f9fa;\n  border-radius: 6px;\n  margin-bottom: 8px;\n}\n.activity-icon[data-v-f35ef754] {\n  font-size: 1.2rem;\n}\n.activity-details[data-v-f35ef754] {\n  flex: 1;\n}\n.activity-description[data-v-f35ef754] {\n  font-size: 0.9rem;\n  color: #333;\n  margin-bottom: 2px;\n}\n.activity-time[data-v-f35ef754] {\n  font-size: 0.8rem;\n  color: #666;\n}\n.modal-content[data-v-f35ef754] {\n  max-height: 80vh;\n  overflow-y: auto;\n  padding: 20px;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n.settings-section[data-v-f35ef754] {\n  margin-bottom: 24px;\n  overflow-y: auto;\n  max-height: calc(80vh - 120px); /* Account for header and padding */\n}\n\n/* Scrollbar styling */\n[data-v-f35ef754]::-webkit-scrollbar {\n  width: 8px;\n}\n[data-v-f35ef754]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 4px;\n}\n[data-v-f35ef754]::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 4px;\n}\n[data-v-f35ef754]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n/* Firefox scrollbar */\n[data-v-f35ef754] {\n  scrollbar-width: thin;\n  scrollbar-color: #888 #f1f1f1;\n}\n.form-note[data-v-f35ef754] {\n  margin-top: 24px;\n  padding: 16px;\n  background: #f8f9ff;\n  border: 1px solid #e1e5f2;\n  border-radius: 8px;\n}\n.form-note p[data-v-f35ef754] {\n  margin: 0 0 12px 0;\n  color: #333;\n  font-weight: 500;\n}\n.form-note ol[data-v-f35ef754] {\n  margin: 0;\n  padding-left: 20px;\n  color: #666;\n}\n.form-note ol li[data-v-f35ef754] {\n  margin-bottom: 4px;\n}\n.sync-section[data-v-f35ef754] {\n  background: #f8f9fa;\n  border: 1px solid #e1e5e9;\n  border-radius: 8px;\n  padding: 20px;\n}\n.sync-description[data-v-f35ef754] {\n  margin-bottom: 20px;\n}\n.sync-description p[data-v-f35ef754] {\n  margin: 0;\n  color: #666;\n  line-height: 1.5;\n}\n.sync-actions[data-v-f35ef754] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.sync-btn[data-v-f35ef754] {\n  padding: 10px 20px;\n  border: 1px solid #007bff;\n  border-radius: 6px;\n  background: white;\n  color: #007bff;\n  cursor: pointer;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  flex: 1;\n}\n.sync-btn[data-v-f35ef754]:hover:not(:disabled) {\n  background: #007bff;\n  color: white;\n}\n.sync-btn[data-v-f35ef754]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.sync-btn.deep[data-v-f35ef754] {\n  border-color: #28a745;\n  color: #28a745;\n}\n.sync-btn.deep[data-v-f35ef754]:hover:not(:disabled) {\n  background: #28a745;\n  color: white;\n}\n.sync-info[data-v-f35ef754] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.sync-type[data-v-f35ef754] {\n  font-size: 0.9rem;\n  color: #666;\n  line-height: 1.4;\n}\n\n/* Backend Configuration Styles */\n.backend-config[data-v-f35ef754] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.backend-actions[data-v-f35ef754] {\n  display: flex;\n  gap: 8px;\n}\n.test-btn[data-v-f35ef754],\n.save-backend-btn[data-v-f35ef754] {\n  padding: 8px 16px;\n  border: 1px solid #007bff;\n  border-radius: 4px;\n  background: white;\n  color: #007bff;\n  cursor: pointer;\n  font-size: 0.85rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  flex: 1;\n}\n.test-btn[data-v-f35ef754]:hover:not(:disabled),\n.save-backend-btn[data-v-f35ef754]:hover:not(:disabled) {\n  background: #007bff;\n  color: white;\n}\n.save-backend-btn[data-v-f35ef754] {\n  border-color: #28a745;\n  color: #28a745;\n}\n.save-backend-btn[data-v-f35ef754]:hover:not(:disabled) {\n  background: #28a745;\n  color: white;\n}\n.test-btn[data-v-f35ef754]:disabled,\n.save-backend-btn[data-v-f35ef754]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.backend-status[data-v-f35ef754] {\n  padding: 8px 12px;\n  border-radius: 4px;\n  font-size: 0.85rem;\n  margin-top: 8px;\n}\n.backend-status.success[data-v-f35ef754] {\n  background: #d4edda;\n  color: #155724;\n  border: 1px solid #c3e6cb;\n}\n.backend-status.error[data-v-f35ef754] {\n  background: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n}\n.backend-status.info[data-v-f35ef754] {\n  background: #d1ecf1;\n  color: #0c5460;\n  border: 1px solid #bee5eb;\n}\n\n.menu-container[data-v-0610845d] {\n  width: 100%;\n}\n.user-status[data-v-0610845d] {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f0f0f0;\n  background: #f8f9fa;\n}\n.user-info[data-v-0610845d] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.user-avatar[data-v-0610845d] {\n  width: 40px;\n  height: 40px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 14px;\n}\n.user-details[data-v-0610845d] {\n  flex: 1;\n}\n.user-name[data-v-0610845d] {\n  font-weight: 600;\n  color: #333;\n  font-size: 14px;\n  margin-bottom: 2px;\n}\n.user-address[data-v-0610845d] {\n  font-family: monospace;\n  font-size: 12px;\n  color: #666;\n  margin-bottom: 2px;\n}\n.user-network[data-v-0610845d] {\n  font-size: 11px;\n  color: #999;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.logout-btn[data-v-0610845d] {\n  background: #dc3545;\n  color: white;\n  border: none;\n  padding: 6px 12px;\n  border-radius: 6px;\n  font-size: 12px;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n.logout-btn[data-v-0610845d]:hover:not(:disabled) {\n  background: #c82333;\n}\n.logout-btn[data-v-0610845d]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.login-prompt[data-v-0610845d] {\n  text-align: center;\n  padding: 20px 0;\n}\n.login-icon[data-v-0610845d] {\n  font-size: 32px;\n  margin-bottom: 8px;\n}\n.login-text[data-v-0610845d] {\n  color: #666;\n  font-size: 14px;\n  margin-bottom: 16px;\n}\n.connect-btn[data-v-0610845d] {\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.connect-btn[data-v-0610845d]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.menu-items[data-v-0610845d] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.menu-item[data-v-0610845d] {\n  padding: 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  background: #ffffff;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.menu-item[data-v-0610845d]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.menu-item .icon[data-v-0610845d] {\n  font-size: 1.25rem;\n  width: 1.5rem;\n  text-align: center;\n}\n.menu-item span[data-v-0610845d]:not(.icon) {\n  font-size: 1rem;\n  color: #2d3748;\n  font-weight: 500;\n}\n\n/* Modal styles */\n.modal-overlay[data-v-0610845d] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-0610845d] {\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  max-width: 90vw;\n  max-height: 90vh;\n  overflow: auto;\n}\n\n.voting-tool-container[data-v-c1fca634] {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 999999;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  pointer-events: none; /* Allow clicks to pass through the container */\n}\n\n/* Floating Button */\n.floating-button[data-v-c1fca634] {\n  width: 60px;\n  height: 60px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 4px 20px rgba(230, 0, 122, 0.4);\n  transition: all 0.3s ease;\n  border: 3px solid white;\n  pointer-events: auto; /* Make the button clickable */\n}\n.floating-button[data-v-c1fca634]:hover {\n  transform: scale(1.1);\n  box-shadow: 0 6px 25px rgba(230, 0, 122, 0.6);\n}\n.floating-button.menu-open[data-v-c1fca634] {\n  background: linear-gradient(135deg, #ff1493, #e6007a);\n}\n.button-icon[data-v-c1fca634] {\n  font-size: 24px;\n  color: white;\n  font-weight: bold;\n}\n.hamburger-icon[data-v-c1fca634] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 3px;\n}\n.hamburger-icon span[data-v-c1fca634] {\n  width: 20px;\n  height: 2px;\n  background-color: white;\n  border-radius: 1px;\n  transition: all 0.3s ease;\n}\n\n/* Dropdown Menu */\n.dropdown-menu[data-v-c1fca634] {\n  position: absolute;\n  bottom: 0;\n  right: 70px;\n  width: 280px;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  overflow: hidden;\n  animation: smoothExpand-c1fca634 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  transform-origin: bottom right;\n  pointer-events: auto; /* Make the menu clickable */\n}\n@keyframes smoothExpand-c1fca634 {\n0% {\n    opacity: 0;\n    transform: scale(0.1);\n}\n100% {\n    opacity: 1;\n    transform: scale(1);\n}\n}\n.menu-content[data-v-c1fca634] {\n  padding: 16px 0;\n}\n.menu-item[data-v-c1fca634] {\n  display: flex;\n  align-items: center;\n  padding: 16px 20px;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  border-bottom: 1px solid #f0f0f0;\n}\n.menu-item[data-v-c1fca634]:last-child {\n  border-bottom: none;\n}\n.menu-item[data-v-c1fca634]:hover {\n  background-color: #f8f9fa;\n}\n.menu-item .icon[data-v-c1fca634] {\n  font-size: 20px;\n  margin-right: 12px;\n  width: 24px;\n  text-align: center;\n}\n.menu-item span[data-v-c1fca634]:last-child {\n  font-size: 14px;\n  color: #333;\n  font-weight: 500;\n}\n\n/* Modal styles */\n.modal-overlay[data-v-85aced2c] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.status-modal[data-v-85aced2c] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-85aced2c] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-85aced2c] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-85aced2c] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-85aced2c]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-85aced2c] {\n  padding: 24px;\n  flex: 1;\n  overflow-y: auto;\n}\n.modal-content p[data-v-85aced2c] {\n  margin: 0 0 16px 0;\n  color: #495057;\n}\n.status-options[data-v-85aced2c] {\n  margin: 16px 0;\n}\n.status-options label[data-v-85aced2c] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #495057;\n}\n.status-list[data-v-85aced2c] {\n  max-height: 300px;\n  overflow-y: auto;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  margin-bottom: 16px;\n}\n.status-option[data-v-85aced2c] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 16px;\n  border: none;\n  border-bottom: 1px solid #f0f0f0;\n  background: white;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  font-size: 0.9rem;\n  width: 100%;\n  text-align: left;\n}\n.status-option[data-v-85aced2c]:last-child {\n  border-bottom: none;\n}\n.status-option[data-v-85aced2c]:hover {\n  background: #f8f9fa;\n}\n.status-option.selected[data-v-85aced2c] {\n  background: linear-gradient(135deg, #fff5f8, #ffe8f0);\n  border-left: 4px solid #e6007a;\n}\n.option-text[data-v-85aced2c] {\n  font-weight: 500;\n  color: #333;\n}\n.selected-indicator[data-v-85aced2c] {\n  color: #e6007a;\n  font-weight: bold;\n  font-size: 1rem;\n}\n.reason-section[data-v-85aced2c] {\n  margin: 16px 0;\n}\n.reason-section label[data-v-85aced2c] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #495057;\n}\n.reason-section textarea[data-v-85aced2c] {\n  width: 100%;\n  padding: 12px;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  font-family: inherit;\n  font-size: 0.9rem;\n  resize: vertical;\n  transition: border-color 0.2s ease;\n}\n.reason-section textarea[data-v-85aced2c]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.modal-actions[data-v-85aced2c] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-85aced2c] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.btn[data-v-85aced2c]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-primary[data-v-85aced2c] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.btn-primary[data-v-85aced2c]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-secondary[data-v-85aced2c] {\n  background: #6c757d;\n  color: white;\n  border: 1px solid #6c757d;\n}\n.btn-secondary[data-v-85aced2c]:hover:not(:disabled) {\n  background: #5a6268;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);\n}\n@media (max-width: 768px) {\n.status-grid[data-v-85aced2c] {\n    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n}\n}\n\n/* Modal styles */\n.modal-overlay[data-v-539e24b0] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.assign-modal[data-v-539e24b0] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-539e24b0] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-539e24b0] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-539e24b0] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-539e24b0]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-539e24b0] {\n  padding: 24px;\n}\n.modal-content p[data-v-539e24b0] {\n  margin: 0 0 16px 0;\n  color: #495057;\n}\n.modal-actions[data-v-539e24b0] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-539e24b0] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.btn[data-v-539e24b0]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-primary[data-v-539e24b0] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.btn-primary[data-v-539e24b0]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-secondary[data-v-539e24b0] {\n  background: #6c757d;\n  color: white;\n  border: 1px solid #6c757d;\n}\n.btn-secondary[data-v-539e24b0]:hover:not(:disabled) {\n  background: #5a6268;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);\n}\n\n/* Modal styles */\n.modal-overlay[data-v-eeb2c9ac] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  backdrop-filter: blur(2px);\n}\n.vote-modal[data-v-eeb2c9ac] {\n  background: white;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 500px;\n  max-height: 80vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.modal-header[data-v-eeb2c9ac] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid #e9ecef;\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border-radius: 12px 12px 0 0;\n}\n.modal-header h3[data-v-eeb2c9ac] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 600;\n}\n.close-btn[data-v-eeb2c9ac] {\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease;\n}\n.close-btn[data-v-eeb2c9ac]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-content[data-v-eeb2c9ac] {\n  padding: 24px;\n}\n.modal-content p[data-v-eeb2c9ac] {\n  margin: 0 0 16px 0;\n  color: #495057;\n}\n.vote-options[data-v-eeb2c9ac] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin: 16px 0;\n}\n.vote-option[data-v-eeb2c9ac] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 16px 20px;\n  border: 2px solid #e9ecef;\n  border-radius: 8px;\n  background: white;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  font-size: 1rem;\n  text-align: center;\n}\n.vote-option[data-v-eeb2c9ac]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.vote-option.selected[data-v-eeb2c9ac] {\n  border-color: #e6007a;\n  background: linear-gradient(135deg, #fff5f8, #ffe8f0);\n}\n.vote-option.aye[data-v-eeb2c9ac]:hover,\n.vote-option.aye.selected[data-v-eeb2c9ac] {\n  border-color: #28a745;\n  background: linear-gradient(135deg, #f8fff9, #e8f5e8);\n}\n.vote-option.nay[data-v-eeb2c9ac]:hover,\n.vote-option.nay.selected[data-v-eeb2c9ac] {\n  border-color: #dc3545;\n  background: linear-gradient(135deg, #fff8f8, #ffe8e8);\n}\n.vote-option.abstain[data-v-eeb2c9ac]:hover,\n.vote-option.abstain.selected[data-v-eeb2c9ac] {\n  border-color: #6f42c1;\n  background: linear-gradient(135deg, #faf8ff, #f0e8ff);\n}\n.vote-icon[data-v-eeb2c9ac] {\n  font-size: 1.5rem;\n}\n.vote-text[data-v-eeb2c9ac] {\n  font-weight: 600;\n}\n.reason-section[data-v-eeb2c9ac] {\n  margin: 16px 0;\n}\n.reason-section label[data-v-eeb2c9ac] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #495057;\n}\n.reason-section textarea[data-v-eeb2c9ac] {\n  width: 100%;\n  padding: 12px;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  font-family: inherit;\n  font-size: 0.9rem;\n  resize: vertical;\n  transition: border-color 0.2s ease;\n}\n.reason-section textarea[data-v-eeb2c9ac]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.modal-actions[data-v-eeb2c9ac] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px solid #e9ecef;\n}\n.btn[data-v-eeb2c9ac] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.btn[data-v-eeb2c9ac]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-primary[data-v-eeb2c9ac] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.btn-primary[data-v-eeb2c9ac]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-secondary[data-v-eeb2c9ac] {\n  background: #6c757d;\n  color: white;\n  border: 1px solid #6c757d;\n}\n.btn-secondary[data-v-eeb2c9ac]:hover:not(:disabled) {\n  background: #5a6268;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);\n}\n@media (max-width: 768px) {\n.vote-options[data-v-eeb2c9ac] {\n    flex-direction: column;\n}\n}\n\n.modal-overlay[data-v-e479232c] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-e479232c] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  width: 400px;\n  max-width: 90vw;\n}\n.modal-header[data-v-e479232c] {\n  padding: 20px 24px 0;\n}\n.modal-header h3[data-v-e479232c] {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: #333;\n}\n.modal-body[data-v-e479232c] {\n  padding: 16px 24px 20px;\n}\n.modal-body p[data-v-e479232c] {\n  margin: 0;\n  color: #666;\n  line-height: 1.5;\n}\n.modal-actions[data-v-e479232c] {\n  padding: 0 24px 24px;\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.cancel-btn[data-v-e479232c], .confirm-btn[data-v-e479232c] {\n  padding: 8px 16px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.cancel-btn[data-v-e479232c] {\n  background: white;\n  color: #666;\n}\n.cancel-btn[data-v-e479232c]:hover {\n  background: #f8f9fa;\n}\n.confirm-btn[data-v-e479232c] {\n  background: #007bff;\n  color: white;\n  border-color: #007bff;\n}\n.confirm-btn[data-v-e479232c]:hover {\n  background: #0056b3;\n  border-color: #0056b3;\n}\n.confirm-btn.danger[data-v-e479232c] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.confirm-btn.danger[data-v-e479232c]:hover {\n  background: #c82333;\n  border-color: #c82333;\n}\n.confirm-btn.warning[data-v-e479232c] {\n  background: #ffc107;\n  border-color: #ffc107;\n  color: #212529;\n}\n.confirm-btn.warning[data-v-e479232c]:hover {\n  background: #e0a800;\n  border-color: #e0a800;\n}\n.confirm-btn.primary[data-v-e479232c] {\n  background: #007bff;\n  border-color: #007bff;\n}\n.confirm-btn.primary[data-v-e479232c]:hover {\n  background: #0056b3;\n  border-color: #0056b3;\n}\n\n.team-actions-panel[data-v-66a5c8c1] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e1e5e9;\n  width: 500px;\n  max-height: 700px;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.panel-header[data-v-66a5c8c1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid #f0f0f0;\n  background: #f8f9fa;\n}\n.panel-header h3[data-v-66a5c8c1] {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: #333;\n}\n.close-btn[data-v-66a5c8c1] {\n  background: none;\n  border: none;\n  font-size: 18px;\n  cursor: pointer;\n  color: #666;\n  padding: 4px;\n  border-radius: 4px;\n}\n.close-btn[data-v-66a5c8c1]:hover {\n  background: #e9ecef;\n}\n.loading-state[data-v-66a5c8c1] {\n  padding: 40px 20px;\n  text-align: center;\n  color: #666;\n}\n.spinner[data-v-66a5c8c1] {\n  width: 32px;\n  height: 32px;\n  border: 3px solid #f0f0f0;\n  border-top: 3px solid #e6007a;\n  border-radius: 50%;\n  animation: spin-66a5c8c1 1s linear infinite;\n  margin: 0 auto 16px;\n}\n@keyframes spin-66a5c8c1 {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n.panel-content[data-v-66a5c8c1] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 20px;\n}\n.agreement-section[data-v-66a5c8c1],\n.team-status-section[data-v-66a5c8c1],\n.user-actions-section[data-v-66a5c8c1],\n.vote-section[data-v-66a5c8c1],\n.discussion-section[data-v-66a5c8c1] {\n  margin-bottom: 24px;\n}\n.agreement-section h4[data-v-66a5c8c1],\n.team-status-section h4[data-v-66a5c8c1],\n.user-actions-section h4[data-v-66a5c8c1],\n.vote-section h4[data-v-66a5c8c1],\n.discussion-section h4[data-v-66a5c8c1] {\n  margin: 0 0 12px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n}\n.agreement-bar[data-v-66a5c8c1] {\n  margin-bottom: 8px;\n}\n.progress-bar[data-v-66a5c8c1] {\n  width: 100%;\n  height: 8px;\n  background: #f0f0f0;\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 8px;\n}\n.progress-fill[data-v-66a5c8c1] {\n  height: 100%;\n  background: linear-gradient(135deg, #28a745, #20c997);\n  transition: width 0.3s ease;\n}\n.progress-fill.vetoed[data-v-66a5c8c1] {\n  background: linear-gradient(135deg, #dc3545, #c82333);\n}\n.agreement-text[data-v-66a5c8c1] {\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n}\n.veto-text[data-v-66a5c8c1] {\n  color: #dc3545;\n  font-weight: 600;\n}\n.veto-reason[data-v-66a5c8c1] {\n  margin-top: 8px;\n  padding: 8px;\n  background: #f8d7da;\n  border: 1px solid #f5c6cb;\n  border-radius: 4px;\n  font-size: 12px;\n  color: #721c24;\n}\n.team-members[data-v-66a5c8c1] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.member-status[data-v-66a5c8c1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px;\n  border-radius: 6px;\n  border: 1px solid #e9ecef;\n}\n.member-status.agreed[data-v-66a5c8c1] {\n  background: #d4edda;\n  border-color: #c3e6cb;\n}\n.member-status.recused[data-v-66a5c8c1] {\n  background: #f8f9fa;\n  border-color: #dee2e6;\n}\n.member-status.discuss[data-v-66a5c8c1] {\n  background: #fff3cd;\n  border-color: #ffeaa7;\n}\n.member-info[data-v-66a5c8c1] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.member-avatar[data-v-66a5c8c1] {\n  width: 24px;\n  height: 24px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 10px;\n}\n.member-name[data-v-66a5c8c1] {\n  font-size: 12px;\n  font-weight: 500;\n  color: #333;\n}\n.member-address[data-v-66a5c8c1] {\n  font-size: 10px;\n  color: #666;\n  font-family: monospace;\n}\n.action-badge[data-v-66a5c8c1] {\n  font-size: 10px;\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-weight: 500;\n}\n.action-agreed[data-v-66a5c8c1] {\n  background: #28a745;\n  color: white;\n}\n.action-recused[data-v-66a5c8c1] {\n  background: #6c757d;\n  color: white;\n}\n.action-discuss[data-v-66a5c8c1] {\n  background: #ffc107;\n  color: #212529;\n}\n.action-pending[data-v-66a5c8c1] {\n  background: #e9ecef;\n  color: #666;\n}\n.action-buttons[data-v-66a5c8c1] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.action-btn[data-v-66a5c8c1] {\n  padding: 8px 12px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  background: white;\n  cursor: pointer;\n  font-size: 12px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.action-btn[data-v-66a5c8c1]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.action-btn.active[data-v-66a5c8c1] {\n  border-color: #e6007a;\n  background: #e6007a;\n  color: white;\n}\n.action-btn[data-v-66a5c8c1]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.agree-btn.active[data-v-66a5c8c1] {\n  background: #28a745;\n  border-color: #28a745;\n}\n.discuss-btn.active[data-v-66a5c8c1] {\n  background: #ffc107;\n  border-color: #ffc107;\n  color: #212529;\n}\n.veto-btn.active[data-v-66a5c8c1] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.recuse-btn.active[data-v-66a5c8c1] {\n  background: #6c757d;\n  border-color: #6c757d;\n}\n.vote-buttons[data-v-66a5c8c1] {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 12px;\n}\n.vote-btn[data-v-66a5c8c1] {\n  flex: 1;\n  padding: 8px 12px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  background: white;\n  cursor: pointer;\n  font-size: 12px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.vote-btn[data-v-66a5c8c1]:hover:not(:disabled) {\n  background: #f8f9fa;\n}\n.vote-btn.active[data-v-66a5c8c1] {\n  color: white;\n}\n.aye-btn.active[data-v-66a5c8c1] {\n  background: #28a745;\n  border-color: #28a745;\n}\n.nay-btn.active[data-v-66a5c8c1] {\n  background: #dc3545;\n  border-color: #dc3545;\n}\n.abstain-btn.active[data-v-66a5c8c1] {\n  background: #6c757d;\n  border-color: #6c757d;\n}\n.reason-input[data-v-66a5c8c1] {\n  width: 100%;\n  min-height: 60px;\n  padding: 8px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 12px;\n  resize: vertical;\n}\n.comments-list[data-v-66a5c8c1] {\n  max-height: 280px;\n  overflow-y: auto;\n  margin-bottom: 16px;\n  border: 1px solid #e9ecef;\n  border-radius: 8px;\n  background: #fafbfc;\n}\n.comment[data-v-66a5c8c1] {\n  padding: 12px;\n  border-bottom: 1px solid #f0f0f0;\n}\n.comment[data-v-66a5c8c1]:last-child {\n  border-bottom: none;\n}\n.comment-header[data-v-66a5c8c1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 8px;\n}\n.comment-author[data-v-66a5c8c1] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.author-avatar[data-v-66a5c8c1] {\n  width: 20px;\n  height: 20px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 8px;\n}\n.author-name[data-v-66a5c8c1] {\n  font-size: 11px;\n  font-weight: 500;\n  color: #333;\n}\n.comment-time[data-v-66a5c8c1] {\n  font-size: 10px;\n  color: #666;\n}\n.delete-comment-btn[data-v-66a5c8c1] {\n  background: none;\n  border: none;\n  font-size: 12px;\n  cursor: pointer;\n  color: #666;\n  padding: 2px;\n  border-radius: 3px;\n}\n.delete-comment-btn[data-v-66a5c8c1]:hover {\n  background: #f8f9fa;\n}\n.comment-content[data-v-66a5c8c1] {\n  font-size: 12px;\n  color: #333;\n  line-height: 1.4;\n}\n.no-comments[data-v-66a5c8c1] {\n  padding: 40px 20px;\n  text-align: center;\n}\n.empty-state[data-v-66a5c8c1] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.empty-icon[data-v-66a5c8c1] {\n  font-size: 32px;\n  opacity: 0.5;\n}\n.empty-text[data-v-66a5c8c1] {\n  font-size: 14px;\n  font-weight: 500;\n  color: #666;\n}\n.empty-subtext[data-v-66a5c8c1] {\n  font-size: 12px;\n  color: #999;\n}\n.add-comment[data-v-66a5c8c1] {\n  border-top: 1px solid #e9ecef;\n  padding-top: 16px;\n}\n.comment-input-wrapper[data-v-66a5c8c1] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.comment-input[data-v-66a5c8c1] {\n  min-height: 80px;\n  padding: 12px;\n  border: 2px solid #dee2e6;\n  border-radius: 8px;\n  font-size: 13px;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  resize: vertical;\n  transition: border-color 0.2s ease;\n}\n.comment-input[data-v-66a5c8c1]:focus {\n  outline: none;\n  border-color: #e6007a;\n  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);\n}\n.comment-actions[data-v-66a5c8c1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.comment-hint[data-v-66a5c8c1] {\n  flex: 1;\n}\n.hint-text[data-v-66a5c8c1] {\n  font-size: 11px;\n  color: #666;\n}\n.add-comment-btn[data-v-66a5c8c1] {\n  padding: 8px 16px;\n  background: linear-gradient(135deg, #e6007a, #ff1493);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.add-comment-btn[data-v-66a5c8c1]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.add-comment-btn[data-v-66a5c8c1]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n/* Modal Styles */\n.modal-overlay[data-v-66a5c8c1] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.modal-content[data-v-66a5c8c1] {\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  max-width: 400px;\n  width: 90%;\n}\n.modal-content h3[data-v-66a5c8c1] {\n  margin: 0 0 16px 0;\n  font-size: 18px;\n  color: #333;\n}\n.veto-reason-input[data-v-66a5c8c1] {\n  width: 100%;\n  min-height: 80px;\n  padding: 12px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  margin: 16px 0;\n  resize: vertical;\n}\n.modal-actions[data-v-66a5c8c1] {\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.cancel-btn[data-v-66a5c8c1],\n.veto-confirm-btn[data-v-66a5c8c1] {\n  padding: 8px 16px;\n  border: 1px solid #dee2e6;\n  border-radius: 6px;\n  font-size: 14px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.cancel-btn[data-v-66a5c8c1] {\n  background: white;\n  color: #333;\n}\n.cancel-btn[data-v-66a5c8c1]:hover {\n  background: #f8f9fa;\n}\n.veto-confirm-btn[data-v-66a5c8c1] {\n  background: #dc3545;\n  color: white;\n  border-color: #dc3545;\n}\n.veto-confirm-btn[data-v-66a5c8c1]:hover:not(:disabled) {\n  background: #c82333;\n}\n.veto-confirm-btn[data-v-66a5c8c1]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n/* Veto Reason Section */\n.veto-reason-section[data-v-66a5c8c1] {\n  background: #fff5f5;\n  border: 1px solid #fed7d7;\n  border-radius: 8px;\n  padding: 16px;\n  margin-bottom: 20px;\n}\n.veto-reason-section h4[data-v-66a5c8c1] {\n  margin: 0 0 12px 0;\n  color: #e53e3e;\n  font-size: 1rem;\n  font-weight: 600;\n}\n.veto-reason-content[data-v-66a5c8c1] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.veto-by[data-v-66a5c8c1] {\n  font-size: 0.9rem;\n  color: #e53e3e;\n}\n.veto-reason-text[data-v-66a5c8c1] {\n  font-size: 0.9rem;\n  color: #2d3748;\n  background: white;\n  padding: 12px;\n  border-radius: 6px;\n  white-space: pre-wrap;\n}\n\n.voting-tool-controls[data-v-69c1b12c] {\n  background: linear-gradient(135deg, #ffffff, #f8f9fa);\n  border: 2px solid #e6007a;\n  border-radius: 12px;\n  padding: 16px;\n  margin-bottom: 16px;\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.15);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n}\n.controls-header[data-v-69c1b12c] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.controls-title[data-v-69c1b12c] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #e6007a;\n  margin: 0;\n}\n.status-badge-wrapper[data-v-69c1b12c] {\n  display: flex;\n  align-items: center;\n}\n.status-badge[data-v-69c1b12c] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 6px 12px;\n  border-radius: 12px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  border: 1px solid rgba(255, 255, 255, 0.6);\n  transition: all 0.2s ease;\n  user-select: none;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);\n  backdrop-filter: blur(3px);\n  white-space: nowrap;\n  min-width: 100px;\n  justify-content: center;\n}\n.status-clickable[data-v-69c1b12c] {\n  cursor: pointer;\n}\n.status-clickable[data-v-69c1b12c]:hover {\n  transform: translateY(-1px) scale(1.02);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n  border-color: rgba(255, 255, 255, 1);\n}\n.status-icon[data-v-69c1b12c] {\n  font-size: 0.9rem;\n}\n.edit-icon[data-v-69c1b12c] {\n  font-size: 0.8rem;\n  opacity: 0.7;\n}\n\n/* Status color classes */\n.status-not-started[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #6c757d, #5a6268); \n  color: white;\n}\n.status-considering[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #ffc107, #e0a800); \n  color: #212529;\n}\n.status-ready-for-approval[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #17a2b8, #138496); \n  color: white;\n}\n.status-waiting-for-agreement[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #fd7e14, #e8680b); \n  color: white;\n}\n.status-ready-to-vote[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #28a745, #1e7e34); \n  color: white;\n}\n.status-reconsidering[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white;\n}\n.status-voted-----aye----[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #198754, #155724); \n  color: white;\n}\n.status-voted-----nay----[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #dc3545, #c82333); \n  color: white;\n}\n.status-voted------abstain------[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #6f42c1, #5a32a3); \n  color: white;\n}\n.status-not-voted[data-v-69c1b12c] { \n  background: linear-gradient(135deg, #e9ecef, #dee2e6); \n  color: #495057;\n}\n.controls-actions[data-v-69c1b12c] {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.control-btn[data-v-69c1b12c] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 16px;\n  border: none;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  white-space: nowrap;\n  flex: 1;\n  justify-content: center;\n  min-width: 140px;\n}\n.control-btn[data-v-69c1b12c]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.assign-btn[data-v-69c1b12c] {\n  background: linear-gradient(135deg, #28a745, #1e7e34);\n  color: white;\n  border: 1px solid #1e7e34;\n}\n.assign-btn[data-v-69c1b12c]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #1e7e34, #155724);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);\n}\n.vote-btn[data-v-69c1b12c] {\n  background: linear-gradient(135deg, #e6007a, #b3005f);\n  color: white;\n  border: 1px solid #b3005f;\n}\n.vote-btn[data-v-69c1b12c]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #b3005f, #8a0047);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);\n}\n.btn-icon[data-v-69c1b12c] {\n  font-size: 1rem;\n}\n.btn-text[data-v-69c1b12c] {\n  font-size: 0.9rem;\n}\n\n/* Team Panel Styles */\n.team-btn[data-v-69c1b12c] {\n  background: linear-gradient(135deg, #17a2b8, #138496);\n  color: white;\n  border: 1px solid #138496;\n}\n.team-btn[data-v-69c1b12c]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #138496, #117a8b);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);\n}\n.team-panel-overlay[data-v-69c1b12c] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n}\n.team-panel-wrapper[data-v-69c1b12c] {\n  max-width: 90vw;\n  max-height: 90vh;\n  overflow: auto;\n}\n\n/* Removed modal styles - now in separate modal components */\n@media (max-width: 768px) {\n.controls-actions[data-v-69c1b12c] {\n    flex-direction: column;\n}\n.control-btn[data-v-69c1b12c] {\n    min-width: auto;\n}\n.vote-options[data-v-69c1b12c] {\n    flex-direction: column;\n}\n.status-grid[data-v-69c1b12c] {\n    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n}\n}\n/*$vite$:1*/";
  document.head.appendChild(__vite_style__);
  /**
  * @vue/shared v3.5.20
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map2 = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map2[key] = 1;
    return (val) => val in map2;
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
  const isFunction$1 = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
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
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
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
    if (isFunction$1(getterOrOptions)) {
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
        } else if (isFunction$1(s)) {
          return call ? call(s, 2) : s();
        } else ;
      });
    } else if (isFunction$1(source)) {
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
    } else if (isFunction$1(value)) {
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
    if (isFunction$1(fn)) {
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
        if (isFunction$1(dir)) {
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
    return isFunction$1(options) ? (
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
    if (isFunction$1(ref3)) {
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
        if (isFunction$1(methodHandler)) {
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
        const get = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
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
      const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
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
      if (isFunction$1(handler)) {
        {
          watch(getter, handler);
        }
      }
    } else if (isFunction$1(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction$1(handler)) {
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
        isFunction$1(to) ? to.call(this, this) : to,
        isFunction$1(from) ? from.call(this, this) : from
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
      if (!isFunction$1(rootComponent)) {
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
          else if (plugin && isFunction$1(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction$1(plugin)) {
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
        return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
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
        if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
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
    if (!isFunction$1(comp)) {
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
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction$1(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = isFunction$1(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction$1(propType) && propType.name === "Boolean";
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
      if (isFunction$1(value)) {
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
    if (isFunction$1(value)) {
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
    if (!isFunction$1(comp)) {
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
    return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction$1(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
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
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction$1(type) ? 2 : 0;
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
    } else if (isFunction$1(children)) {
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
    if (isFunction$1(setupResult)) {
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
    return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
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
    return isFunction$1(value) && "__vccOpts" in value;
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
      if (key in el && isNativeOn(key) && isFunction$1(value)) {
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
      if (!isFunction$1(component) && !component.render && !component.template) {
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
    async getProposal(postId, chain2) {
      try {
        const result = await this.request(`/dao/referendum/${postId}?chain=${chain2}`);
        return result.referendum || null;
      } catch (error) {
        console.error("Failed to fetch proposal:", error);
        return null;
      }
    }
    async updateProposalStatus(postId, chain2, status) {
      try {
        console.log(`🔄 Updating status: PUT /referendums/${postId}/${chain2}`, { internal_status: status });
        console.log(`🔐 Auth token present: ${!!this.token}`);
        const updatedReferendum = await this.request(`/referendums/${postId}/${chain2}`, {
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
    async assignProposal(postId, chain2, action) {
      try {
        const result = await this.request(`/dao/referendum/${postId}/action`, {
          method: "POST",
          body: JSON.stringify({
            chain: chain2,
            action
          })
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to assign proposal" };
      }
    }
    async updateSuggestedVote(postId, chain2, vote, reason) {
      try {
        const result = await this.request(`/referendums/${postId}/${chain2}`, {
          method: "PUT",
          body: JSON.stringify({
            suggested_vote: vote,
            reason_for_vote: reason
            // Store reason in referendums table
          })
        });
        if (result && result.id) {
          return { success: true };
        } else {
          return { success: false, error: "No referendum data returned" };
        }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to update suggested vote" };
      }
    }
    async updateFinalVote(postId, chain2, vote, reason) {
      try {
        const result = await this.request(`/referendums/${postId}/${chain2}`, {
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
    async submitTeamAction(postId, chain2, action, reason) {
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
          chain: chain2,
          action,
          backendAction,
          reason
        });
        const result = await this.request(`/dao/referendum/${postId}/action`, {
          method: "POST",
          body: JSON.stringify({
            chain: chain2,
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
    async deleteTeamAction(postId, chain2) {
      try {
        const result = await this.request(`/dao/referendum/${postId}/action`, {
          method: "DELETE",
          body: JSON.stringify({
            chain: chain2
          })
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete team action" };
      }
    }
    async getTeamActions(postId, chain2) {
      try {
        const result = await this.request(`/dao/referendum/${postId}/actions?chain=${chain2}`);
        return result.actions || [];
      } catch (error) {
        console.error("Failed to fetch team actions:", error);
        return [];
      }
    }
    async getAgreementSummary(postId, chain2) {
      try {
        const result = await this.request(`/dao/referendum/${postId}/agreement-summary?chain=${chain2}`);
        return result.summary || null;
      } catch (error) {
        console.error("Failed to fetch agreement summary:", error);
        return null;
      }
    }
    async addComment(postId, chain2, content) {
      try {
        const result = await this.request(`/dao/referendum/${postId}/comments`, {
          method: "POST",
          body: JSON.stringify({
            chain: chain2,
            content
          })
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to add comment" };
      }
    }
    async getComments(postId, chain2) {
      try {
        const result = await this.request(`/dao/referendum/${postId}/comments?chain=${chain2}`);
        return result.comments || [];
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        return [];
      }
    }
    async deleteComment(commentId) {
      try {
        const result = await this.request(`/dao/comments/${commentId}`, {
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
        const result = await this.request("/dao/members");
        if (result.success && result.members) {
          const config2 = {
            team_members: result.members,
            required_agreements: 4,
            // Default value, could be made configurable
            name: "OpenGov Voting Tool"
            // Simple static name
          };
          return config2;
        } else {
          console.error("Failed to get DAO config:", result.error);
          return null;
        }
      } catch (error) {
        console.error("Error getting DAO config:", error);
        return null;
      }
    }
    async updateDAOConfig(config2) {
      try {
        const result = await this.request("/dao/config", {
          method: "PUT",
          body: JSON.stringify(config2)
        });
        return result;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to update DAO config" };
      }
    }
    async triggerSync(type = "normal") {
      try {
        const result = await this.request("/dao/sync", {
          method: "POST",
          body: JSON.stringify({ type })
        });
        return {
          success: result.success,
          message: result.message,
          error: result.error
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to trigger sync"
        };
      }
    }
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
        const result = await this.request(`/referendums/status/${encodeURIComponent(status)}`);
        return result.referendums || [];
      } catch (error) {
        console.error("Failed to fetch proposals by status:", error);
        return [];
      }
    }
    async getAllProposals(chain2) {
      try {
        console.log("🔍 getAllProposals called", { chain: chain2, baseUrl: this.baseUrl, hasToken: !!this.token });
        const queryParam = chain2 ? `?chain=${chain2}` : "";
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
    async getProposalsNeedingAttention() {
      try {
        const result = await this.request("/dao/needs-attention");
        return result.referendums || [];
      } catch (error) {
        console.error("Failed to fetch proposals needing attention:", error);
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
          const allProposalsResult = await this.request("/dao/proposals");
          if (allProposalsResult.success && allProposalsResult.referendums) {
            allProposals = allProposalsResult.referendums;
            console.log("✅ Got all proposals from /dao/proposals:", allProposals.length);
          }
        } catch (error) {
          console.warn("Could not get all proposals, trying individual methods");
          const proposals = [];
          try {
            const assignments = await this.getMyAssignments();
            proposals.push(...assignments);
          } catch (error2) {
            console.warn("getMyAssignments failed:", error2);
          }
          try {
            const needingAttention = await this.getProposalsNeedingAttention();
            proposals.push(...needingAttention);
          } catch (error2) {
            console.warn("getProposalsNeedingAttention failed:", error2);
          }
          allProposals = proposals;
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
    async ensureReferendumExists(postId, chain2) {
      try {
        const existing = await this.getProposal(postId, chain2);
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
        await this.request(`/admin/refresh-referendas?limit=50`, {
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
  function evaluateThis(fn) {
    return fn("return this");
  }
  const xglobal = typeof globalThis !== "undefined" ? globalThis : typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : evaluateThis(Function);
  function extractGlobal(name, fallback) {
    return typeof xglobal[name] === "undefined" ? fallback : xglobal[name];
  }
  let TextDecoder$1 = class TextDecoder {
    constructor(encoding) {
      __publicField(this, "__encoding");
      this.__encoding = encoding;
    }
    decode(value) {
      let result = "";
      for (let i = 0, count = value.length; i < count; i++) {
        result += String.fromCharCode(value[i]);
      }
      return result;
    }
  };
  const TextDecoder = /* @__PURE__ */ extractGlobal("TextDecoder", TextDecoder$1);
  let TextEncoder$2 = class TextEncoder {
    encode(value) {
      const count = value.length;
      const u8a = new Uint8Array(count);
      for (let i = 0; i < count; i++) {
        u8a[i] = value.charCodeAt(i);
      }
      return u8a;
    }
  };
  const TextEncoder$1 = /* @__PURE__ */ extractGlobal("TextEncoder", TextEncoder$2);
  function isFunction(value) {
    return typeof value === "function";
  }
  function invalidFallback() {
    return Number.NaN;
  }
  const BigInt$1 = /* @__PURE__ */ extractGlobal("BigInt", invalidFallback);
  const CHR$1 = "0123456789abcdef";
  const U8 = new Uint8Array(256);
  const U16 = new Uint8Array(256 * 256);
  for (let i = 0, count = CHR$1.length; i < count; i++) {
    U8[CHR$1[i].charCodeAt(0) | 0] = i | 0;
    if (i > 9) {
      U8[CHR$1[i].toUpperCase().charCodeAt(0) | 0] = i | 0;
    }
  }
  for (let i = 0; i < 256; i++) {
    const s = i << 8;
    for (let j = 0; j < 256; j++) {
      U16[s | j] = U8[i] << 4 | U8[j];
    }
  }
  function hexToU8a(value, bitLength = -1) {
    if (!value) {
      return new Uint8Array();
    }
    let s = value.startsWith("0x") ? 2 : 0;
    const decLength = Math.ceil((value.length - s) / 2);
    const endLength = Math.ceil(bitLength === -1 ? decLength : bitLength / 8);
    const result = new Uint8Array(endLength);
    const offset = endLength > decLength ? endLength - decLength : 0;
    for (let i = offset; i < endLength; i++, s += 2) {
      result[i] = U16[value.charCodeAt(s) << 8 | value.charCodeAt(s + 1)];
    }
    return result;
  }
  const REGEX_HEX_PREFIXED = /^0x[\da-fA-F]+$/;
  function isHex(value, bitLength = -1, ignoreLength) {
    return typeof value === "string" && (value === "0x" || REGEX_HEX_PREFIXED.test(value)) && (bitLength === -1 ? ignoreLength || value.length % 2 === 0 : value.length === 2 + Math.ceil(bitLength / 4));
  }
  const hasBigInt = typeof BigInt$1 === "function" && typeof BigInt$1.asIntN === "function";
  const hasBuffer = typeof xglobal.Buffer === "function" && typeof xglobal.Buffer.isBuffer === "function";
  typeof xglobal.process === "object";
  function isBuffer(value) {
    return hasBuffer && !!value && isFunction(value.readDoubleLE) && xglobal.Buffer.isBuffer(value);
  }
  function isU8a(value) {
    return (value && value.constructor) === Uint8Array || value instanceof Uint8Array;
  }
  const encoder = new TextEncoder$1();
  function stringToU8a(value) {
    return value ? encoder.encode(value.toString()) : new Uint8Array();
  }
  function u8aToU8a(value, strict = false) {
    if (strict && (value === null || value === void 0)) {
      throw new Error("u8aToU8a: Expected non-null, non-undefined value");
    }
    return isU8a(value) ? isBuffer(value) ? new Uint8Array(value) : value : isHex(value) ? hexToU8a(value) : Array.isArray(value) ? new Uint8Array(value) : stringToU8a(value);
  }
  function u8aConcat(...list) {
    const count = list.length;
    const u8as = new Array(count);
    let length = 0;
    for (let i = 0; i < count; i++) {
      u8as[i] = u8aToU8a(list[i]);
      length += u8as[i].length;
    }
    return u8aConcatStrict(u8as, length);
  }
  function u8aConcatStrict(u8as, length = 0) {
    const count = u8as.length;
    let offset = 0;
    if (!length) {
      for (let i = 0; i < count; i++) {
        length += u8as[i].length;
      }
    }
    const result = new Uint8Array(length);
    for (let i = 0; i < count; i++) {
      result.set(u8as[i], offset);
      offset += u8as[i].length;
    }
    return result;
  }
  const decoder = new TextDecoder("utf-8");
  function u8aToString(value) {
    return value ? decoder.decode(value) : "";
  }
  const crypto = xglobal.crypto;
  function getRandomValues(arr) {
    return crypto.getRandomValues(arr);
  }
  const DEFAULT_CRYPTO = { getRandomValues };
  const DEFAULT_SELF = { crypto: DEFAULT_CRYPTO };
  class Wbg {
    constructor(bridge2) {
      __privateAdd(this, _bridge);
      /** @internal */
      __publicField(this, "abort", () => {
        throw new Error("abort");
      });
      /** @internal */
      __publicField(this, "__wbindgen_is_undefined", (idx) => {
        return __privateGet(this, _bridge).getObject(idx) === void 0;
      });
      /** @internal */
      __publicField(this, "__wbindgen_throw", (ptr, len) => {
        throw new Error(__privateGet(this, _bridge).getString(ptr, len));
      });
      /** @internal */
      __publicField(this, "__wbg_self_1b7a39e3a92c949c", () => {
        return __privateGet(this, _bridge).addObject(DEFAULT_SELF);
      });
      /** @internal */
      __publicField(this, "__wbg_require_604837428532a733", (ptr, len) => {
        throw new Error(`Unable to require ${__privateGet(this, _bridge).getString(ptr, len)}`);
      });
      /** @internal */
      __publicField(this, "__wbg_crypto_968f1772287e2df0", (_idx) => {
        return __privateGet(this, _bridge).addObject(DEFAULT_CRYPTO);
      });
      /** @internal */
      __publicField(this, "__wbg_getRandomValues_a3d34b4fee3c2869", (_idx) => {
        return __privateGet(this, _bridge).addObject(DEFAULT_CRYPTO.getRandomValues);
      });
      /** @internal */
      __publicField(this, "__wbg_getRandomValues_f5e14ab7ac8e995d", (_arg0, ptr, len) => {
        DEFAULT_CRYPTO.getRandomValues(__privateGet(this, _bridge).getU8a(ptr, len));
      });
      /** @internal */
      __publicField(this, "__wbg_randomFillSync_d5bd2d655fdf256a", (_idx, _ptr, _len) => {
        throw new Error("randomFillsync is not available");
      });
      /** @internal */
      __publicField(this, "__wbindgen_object_drop_ref", (idx) => {
        __privateGet(this, _bridge).takeObject(idx);
      });
      __privateSet(this, _bridge, bridge2);
    }
  }
  _bridge = new WeakMap();
  class Bridge {
    constructor(createWasm2) {
      __privateAdd(this, _createWasm);
      __privateAdd(this, _heap);
      __privateAdd(this, _wbg);
      __privateAdd(this, _cachegetInt32);
      __privateAdd(this, _cachegetUint8);
      __privateAdd(this, _heapNext);
      __privateAdd(this, _wasm);
      __privateAdd(this, _wasmError);
      __privateAdd(this, _wasmPromise);
      __privateAdd(this, _type);
      __privateSet(this, _createWasm, createWasm2);
      __privateSet(this, _cachegetInt32, null);
      __privateSet(this, _cachegetUint8, null);
      __privateSet(this, _heap, new Array(32).fill(void 0).concat(void 0, null, true, false));
      __privateSet(this, _heapNext, __privateGet(this, _heap).length);
      __privateSet(this, _type, "none");
      __privateSet(this, _wasm, null);
      __privateSet(this, _wasmError, null);
      __privateSet(this, _wasmPromise, null);
      __privateSet(this, _wbg, __spreadValues({}, new Wbg(this)));
    }
    /** @description Returns the init error */
    get error() {
      return __privateGet(this, _wasmError);
    }
    /** @description Returns the init type */
    get type() {
      return __privateGet(this, _type);
    }
    /** @description Returns the created wasm interface */
    get wasm() {
      return __privateGet(this, _wasm);
    }
    /** @description Performs the wasm initialization */
    async init(createWasm2) {
      if (!__privateGet(this, _wasmPromise) || createWasm2) {
        __privateSet(this, _wasmPromise, (createWasm2 || __privateGet(this, _createWasm))(__privateGet(this, _wbg)));
      }
      const { error, type, wasm } = await __privateGet(this, _wasmPromise);
      __privateSet(this, _type, type);
      __privateSet(this, _wasm, wasm);
      __privateSet(this, _wasmError, error);
      return __privateGet(this, _wasm);
    }
    /**
     * @internal
     * @description Gets an object from the heap
     */
    getObject(idx) {
      return __privateGet(this, _heap)[idx];
    }
    /**
     * @internal
     * @description Removes an object from the heap
     */
    dropObject(idx) {
      if (idx < 36) {
        return;
      }
      __privateGet(this, _heap)[idx] = __privateGet(this, _heapNext);
      __privateSet(this, _heapNext, idx);
    }
    /**
     * @internal
     * @description Retrieves and removes an object to the heap
     */
    takeObject(idx) {
      const ret = this.getObject(idx);
      this.dropObject(idx);
      return ret;
    }
    /**
     * @internal
     * @description Adds an object to the heap
     */
    addObject(obj) {
      if (__privateGet(this, _heapNext) === __privateGet(this, _heap).length) {
        __privateGet(this, _heap).push(__privateGet(this, _heap).length + 1);
      }
      const idx = __privateGet(this, _heapNext);
      __privateSet(this, _heapNext, __privateGet(this, _heap)[idx]);
      __privateGet(this, _heap)[idx] = obj;
      return idx;
    }
    /**
     * @internal
     * @description Retrieve an Int32 in the WASM interface
     */
    getInt32() {
      if (__privateGet(this, _cachegetInt32) === null || __privateGet(this, _cachegetInt32).buffer !== __privateGet(this, _wasm).memory.buffer) {
        __privateSet(this, _cachegetInt32, new Int32Array(__privateGet(this, _wasm).memory.buffer));
      }
      return __privateGet(this, _cachegetInt32);
    }
    /**
     * @internal
     * @description Retrieve an Uint8Array in the WASM interface
     */
    getUint8() {
      if (__privateGet(this, _cachegetUint8) === null || __privateGet(this, _cachegetUint8).buffer !== __privateGet(this, _wasm).memory.buffer) {
        __privateSet(this, _cachegetUint8, new Uint8Array(__privateGet(this, _wasm).memory.buffer));
      }
      return __privateGet(this, _cachegetUint8);
    }
    /**
     * @internal
     * @description Retrieves an Uint8Array in the WASM interface
     */
    getU8a(ptr, len) {
      return this.getUint8().subarray(ptr / 1, ptr / 1 + len);
    }
    /**
     * @internal
     * @description Retrieves a string in the WASM interface
     */
    getString(ptr, len) {
      return u8aToString(this.getU8a(ptr, len));
    }
    /**
     * @internal
     * @description Allocates an Uint8Array in the WASM interface
     */
    allocU8a(arg) {
      const ptr = __privateGet(this, _wasm).__wbindgen_malloc(arg.length * 1);
      this.getUint8().set(arg, ptr / 1);
      return [ptr, arg.length];
    }
    /**
     * @internal
     * @description Allocates a string in the WASM interface
     */
    allocString(arg) {
      return this.allocU8a(stringToU8a(arg));
    }
    /**
     * @internal
     * @description Retrieves an Uint8Array from the WASM interface
     */
    resultU8a() {
      const r0 = this.getInt32()[8 / 4 + 0];
      const r1 = this.getInt32()[8 / 4 + 1];
      const ret = this.getU8a(r0, r1).slice();
      __privateGet(this, _wasm).__wbindgen_free(r0, r1 * 1);
      return ret;
    }
    /**
     * @internal
     * @description Retrieve a string from the WASM interface
     */
    resultString() {
      return u8aToString(this.resultU8a());
    }
  }
  _createWasm = new WeakMap();
  _heap = new WeakMap();
  _wbg = new WeakMap();
  _cachegetInt32 = new WeakMap();
  _cachegetUint8 = new WeakMap();
  _heapNext = new WeakMap();
  _wasm = new WeakMap();
  _wasmError = new WeakMap();
  _wasmPromise = new WeakMap();
  _type = new WeakMap();
  function createWasmFn(root, wasmBytes2, asmFn) {
    return async (wbg) => {
      const result = {
        error: null,
        type: "none",
        wasm: null
      };
      try {
        if (!(wasmBytes2 == null ? void 0 : wasmBytes2.length)) {
          throw new Error("No WebAssembly provided for initialization");
        } else if (typeof WebAssembly !== "object" || typeof WebAssembly.instantiate !== "function") {
          throw new Error("WebAssembly is not available in your environment");
        }
        const source = await WebAssembly.instantiate(wasmBytes2, { wbg });
        result.wasm = source.instance.exports;
        result.type = "wasm";
      } catch (error) {
        {
          result.error = `FATAL: Unable to initialize @polkadot/wasm-${root}:: ${error.message}`;
          console.error(result.error);
        }
      }
      return result;
    };
  }
  const CHR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const map = new Array(256);
  for (let i = 0, count = CHR.length; i < count; i++) {
    map[CHR.charCodeAt(i)] = i;
  }
  function base64Decode(data, out) {
    let byte = 0;
    let bits2 = 0;
    let pos = -1;
    for (let i = 0, last = out.length - 1; pos !== last; i++) {
      byte = byte << 6 | map[data.charCodeAt(i)];
      if ((bits2 += 6) >= 8) {
        out[++pos] = byte >>> (bits2 -= 8) & 255;
      }
    }
    return out;
  }
  const u8 = Uint8Array, u16 = Uint16Array, u32$1 = Uint32Array;
  const clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  const fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  const fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  const freb = (eb, start) => {
    const b = new u16(31);
    for (let i = 0; i < 31; ++i) {
      b[i] = start += 1 << eb[i - 1];
    }
    const r = new u32$1(b[30]);
    for (let i = 1; i < 30; ++i) {
      for (let j = b[i]; j < b[i + 1]; ++j) {
        r[j] = j - b[i] << 5 | i;
      }
    }
    return [b, r];
  };
  const [fl, revfl] = freb(fleb, 2);
  fl[28] = 258, revfl[258] = 28;
  const [fd] = freb(fdeb, 0);
  const rev = new u16(32768);
  for (let i = 0; i < 32768; ++i) {
    let x = (i & 43690) >>> 1 | (i & 21845) << 1;
    x = (x & 52428) >>> 2 | (x & 13107) << 2;
    x = (x & 61680) >>> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >>> 8 | (x & 255) << 8) >>> 1;
  }
  const hMap = (cd, mb, r) => {
    const s = cd.length;
    let i = 0;
    const l = new u16(mb);
    for (; i < s; ++i) {
      if (cd[i])
        ++l[cd[i] - 1];
    }
    const le = new u16(mb);
    for (i = 1; i < mb; ++i) {
      le[i] = le[i - 1] + l[i - 1] << 1;
    }
    let co;
    {
      co = new u16(1 << mb);
      const rvb = 15 - mb;
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          const sv = i << 4 | cd[i];
          const r2 = mb - cd[i];
          let v = le[cd[i] - 1]++ << r2;
          for (const m = v | (1 << r2) - 1; v <= m; ++v) {
            co[rev[v] >> rvb] = sv;
          }
        }
      }
    }
    return co;
  };
  const flt = new u8(288);
  for (let i = 0; i < 144; ++i)
    flt[i] = 8;
  for (let i = 144; i < 256; ++i)
    flt[i] = 9;
  for (let i = 256; i < 280; ++i)
    flt[i] = 7;
  for (let i = 280; i < 288; ++i)
    flt[i] = 8;
  const fdt = new u8(32);
  for (let i = 0; i < 32; ++i)
    fdt[i] = 5;
  const flrm = hMap(flt, 9);
  const fdrm = hMap(fdt, 5);
  const bits = (d, p2, m) => {
    const o = p2 >>> 3;
    return (d[o] | d[o + 1] << 8) >>> (p2 & 7) & m;
  };
  const bits16 = (d, p2) => {
    const o = p2 >>> 3;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >>> (p2 & 7);
  };
  const shft = (p2) => (p2 >>> 3) + (p2 & 7 && 1);
  const slc = (v, s, e) => {
    if (e == null || e > v.length)
      e = v.length;
    const n = new (v instanceof u16 ? u16 : v instanceof u32$1 ? u32$1 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
  };
  const max = (a) => {
    let m = a[0];
    for (let i = 1, count = a.length; i < count; ++i) {
      if (a[i] > m)
        m = a[i];
    }
    return m;
  };
  const inflt = (dat, buf, st) => {
    const noSt = !st || st.i;
    if (!st)
      st = {};
    const sl = dat.length;
    const noBuf = !buf || !noSt;
    if (!buf)
      buf = new u8(sl * 3);
    const cbuf = (l) => {
      let bl = buf.length;
      if (l > bl) {
        const nbuf = new u8(Math.max(bl << 1, l));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    let final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    if (final && !lm)
      return buf;
    const tbts = sl << 3;
    do {
      if (!lm) {
        st.f = final = bits(dat, pos, 1);
        const type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          const s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              throw "unexpected EOF";
            break;
          }
          if (noBuf)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t << 3;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          const hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          const tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          const ldt = new u8(tl);
          const clt = new u8(19);
          for (let i = 0; i < hcLen; ++i) {
            clt[clim[i]] = bits(dat, pos + i * 3, 7);
          }
          pos += hcLen * 3;
          const clb = max(clt), clbmsk = (1 << clb) - 1;
          if (!noSt && pos + tl * (clb + 7) > tbts)
            break;
          const clm = hMap(clt, clb);
          for (let i = 0; i < tl; ) {
            const r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            const s = r >>> 4;
            if (s < 16) {
              ldt[i++] = s;
            } else {
              let c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i++] = c;
            }
          }
          const lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt);
          dm = hMap(dt, dbt);
        } else
          throw "invalid block type";
        if (pos > tbts)
          throw "unexpected EOF";
      }
      if (noBuf)
        cbuf(bt + 131072);
      const lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      const mxa = lbt + dbt + 18;
      while (noSt || pos + mxa < tbts) {
        const c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
        pos += c & 15;
        if (pos > tbts)
          throw "unexpected EOF";
        if (!c)
          throw "invalid length/literal";
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lm = void 0;
          break;
        } else {
          let add2 = sym - 254;
          if (sym > 264) {
            const i = sym - 257, b = fleb[i];
            add2 = bits(dat, pos, (1 << b) - 1) + fl[i];
            pos += b;
          }
          const d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
          if (!d)
            throw "invalid distance";
          pos += d & 15;
          let dt = fd[dsym];
          if (dsym > 3) {
            const b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts)
            throw "unexpected EOF";
          if (noBuf)
            cbuf(bt + 131072);
          const end = bt + add2;
          for (; bt < end; bt += 4) {
            buf[bt] = buf[bt - dt];
            buf[bt + 1] = buf[bt + 1 - dt];
            buf[bt + 2] = buf[bt + 2 - dt];
            buf[bt + 3] = buf[bt + 3 - dt];
          }
          bt = end;
        }
      }
      st.l = lm, st.p = pos, st.b = bt;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
  };
  const zlv = (d) => {
    if ((d[0] & 15) != 8 || d[0] >>> 4 > 7 || (d[0] << 8 | d[1]) % 31)
      throw "invalid zlib data";
    if (d[1] & 32)
      throw "invalid zlib data: preset dictionaries not supported";
  };
  function unzlibSync(data, out) {
    return inflt((zlv(data), data.subarray(2, -4)), out);
  }
  var lenIn = 176940;
  var lenOut = 355100;
  var bytes_1 = "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";
  const wasmBytes = /* @__PURE__ */ unzlibSync(base64Decode(bytes_1, new Uint8Array(lenIn)), new Uint8Array(lenOut));
  const createWasm = /* @__PURE__ */ createWasmFn("crypto", wasmBytes);
  const bridge = new Bridge(createWasm);
  function withWasm(fn) {
    return (...params) => {
      if (!bridge.wasm) {
        throw new Error("The WASM interface has not been initialized. Ensure that you wait for the initialization Promise with waitReady() from @polkadot/wasm-crypto (or cryptoWaitReady() from @polkadot/util-crypto) before attempting to use WASM-only interfaces.");
      }
      return fn(bridge.wasm, ...params);
    };
  }
  const blake2b$2 = /* @__PURE__ */ withWasm((wasm, data, key, size) => {
    wasm.ext_blake2b(8, ...bridge.allocU8a(data), ...bridge.allocU8a(key), size);
    return bridge.resultU8a();
  });
  function isReady() {
    return !!bridge.wasm;
  }
  /*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  function isBytes$1(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function isArrayOf(isString2, arr) {
    if (!Array.isArray(arr))
      return false;
    if (arr.length === 0)
      return true;
    if (isString2) {
      return arr.every((item) => typeof item === "string");
    } else {
      return arr.every((item) => Number.isSafeInteger(item));
    }
  }
  function astr(label, input) {
    if (typeof input !== "string")
      throw new Error(`${label}: string expected`);
    return true;
  }
  function anumber$1(n) {
    if (!Number.isSafeInteger(n))
      throw new Error(`invalid integer: ${n}`);
  }
  function aArr(input) {
    if (!Array.isArray(input))
      throw new Error("array expected");
  }
  function astrArr(label, input) {
    if (!isArrayOf(true, input))
      throw new Error(`${label}: array of strings expected`);
  }
  function anumArr(label, input) {
    if (!isArrayOf(false, input))
      throw new Error(`${label}: array of numbers expected`);
  }
  // @__NO_SIDE_EFFECTS__
  function chain(...args) {
    const id = (a) => a;
    const wrap = (a, b) => (c) => a(b(c));
    const encode = args.map((x) => x.encode).reduceRight(wrap, id);
    const decode = args.map((x) => x.decode).reduce(wrap, id);
    return { encode, decode };
  }
  // @__NO_SIDE_EFFECTS__
  function alphabet(letters) {
    const lettersA = typeof letters === "string" ? letters.split("") : letters;
    const len = lettersA.length;
    astrArr("alphabet", lettersA);
    const indexes = new Map(lettersA.map((l, i) => [l, i]));
    return {
      encode: (digits) => {
        aArr(digits);
        return digits.map((i) => {
          if (!Number.isSafeInteger(i) || i < 0 || i >= len)
            throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
          return lettersA[i];
        });
      },
      decode: (input) => {
        aArr(input);
        return input.map((letter) => {
          astr("alphabet.decode", letter);
          const i = indexes.get(letter);
          if (i === void 0)
            throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
          return i;
        });
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function join(separator = "") {
    astr("join", separator);
    return {
      encode: (from) => {
        astrArr("join.decode", from);
        return from.join(separator);
      },
      decode: (to) => {
        astr("join.decode", to);
        return to.split(separator);
      }
    };
  }
  function convertRadix(data, from, to) {
    if (from < 2)
      throw new Error(`convertRadix: invalid from=${from}, base cannot be less than 2`);
    if (to < 2)
      throw new Error(`convertRadix: invalid to=${to}, base cannot be less than 2`);
    aArr(data);
    if (!data.length)
      return [];
    let pos = 0;
    const res = [];
    const digits = Array.from(data, (d) => {
      anumber$1(d);
      if (d < 0 || d >= from)
        throw new Error(`invalid integer: ${d}`);
      return d;
    });
    const dlen = digits.length;
    while (true) {
      let carry = 0;
      let done = true;
      for (let i = pos; i < dlen; i++) {
        const digit = digits[i];
        const fromCarry = from * carry;
        const digitBase = fromCarry + digit;
        if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) {
          throw new Error("convertRadix: carry overflow");
        }
        const div = digitBase / to;
        carry = digitBase % to;
        const rounded = Math.floor(div);
        digits[i] = rounded;
        if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
          throw new Error("convertRadix: carry overflow");
        if (!done)
          continue;
        else if (!rounded)
          pos = i;
        else
          done = false;
      }
      res.push(carry);
      if (done)
        break;
    }
    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
      res.push(0);
    return res.reverse();
  }
  // @__NO_SIDE_EFFECTS__
  function radix(num) {
    anumber$1(num);
    const _256 = 2 ** 8;
    return {
      encode: (bytes) => {
        if (!isBytes$1(bytes))
          throw new Error("radix.encode input should be Uint8Array");
        return convertRadix(Array.from(bytes), _256, num);
      },
      decode: (digits) => {
        anumArr("radix.decode", digits);
        return Uint8Array.from(convertRadix(digits, num, _256));
      }
    };
  }
  const genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => /* @__PURE__ */ chain(/* @__PURE__ */ radix(58), /* @__PURE__ */ alphabet(abc), /* @__PURE__ */ join(""));
  const base58 = /* @__PURE__ */ genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
  function createDecode({ coder, ipfs }, validate) {
    return (value, ipfsCompat) => {
      validate(value, ipfsCompat);
      return coder.decode(ipfsCompat ? value.substring(1) : value);
    };
  }
  function createEncode({ coder, ipfs }) {
    return (value, ipfsCompat) => {
      const out = coder.encode(u8aToU8a(value));
      return ipfsCompat ? `${ipfs}${out}` : out;
    };
  }
  function createValidate({ chars, ipfs, type, withPadding }) {
    return (value, ipfsCompat) => {
      if (typeof value !== "string") {
        throw new Error(`Expected ${type} string input`);
      } else if (ipfsCompat && !value.startsWith(ipfs)) {
        throw new Error(`Expected ipfs-compatible ${type} to start with '${ipfs}'`);
      }
      for (let i = ipfsCompat ? 1 : 0, count = value.length; i < count; i++) {
        if (chars.includes(value[i])) ;
        else if (withPadding && value[i] === "=") {
          if (i === count - 1) ;
          else if (value[i + 1] === "=") ;
          else {
            throw new Error(`Invalid ${type} padding sequence "${value[i]}${value[i + 1]}" at index ${i}`);
          }
        } else {
          throw new Error(`Invalid ${type} character "${value[i]}" (0x${value.charCodeAt(i).toString(16)}) at index ${i}`);
        }
      }
      return true;
    };
  }
  const config = {
    chars: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    coder: base58,
    ipfs: "z",
    type: "base58"
  };
  const base58Validate = /* @__PURE__ */ createValidate(config);
  const base58Decode = /* @__PURE__ */ createDecode(config, base58Validate);
  const base58Encode = /* @__PURE__ */ createEncode(config);
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function abytes(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  function byteSwap(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  const swap8IfBE = isLE ? (n) => n : (n) => byteSwap(n);
  function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap(arr[i]);
    }
    return arr;
  }
  const swap32IfBE = isLE ? (u) => u : byteSwap32;
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    abytes(data);
    return data;
  }
  class Hash {
  }
  function createOptHasher(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
  }
  const BSIGMA = /* @__PURE__ */ Uint8Array.from([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9,
    12,
    5,
    1,
    15,
    14,
    13,
    4,
    10,
    0,
    7,
    6,
    3,
    9,
    2,
    8,
    11,
    13,
    11,
    7,
    14,
    12,
    1,
    3,
    9,
    5,
    0,
    15,
    4,
    8,
    6,
    2,
    10,
    6,
    15,
    14,
    9,
    11,
    3,
    0,
    8,
    12,
    2,
    13,
    7,
    1,
    4,
    10,
    5,
    10,
    2,
    8,
    4,
    7,
    6,
    1,
    5,
    15,
    11,
    9,
    14,
    3,
    12,
    13,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    // Blake1, unused in others
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9
  ]);
  const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  const _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  const rotrSH = (h, l, s) => h >>> s | l << 32 - s;
  const rotrSL = (h, l, s) => h << 32 - s | l >>> s;
  const rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
  const rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
  const rotr32H = (_h, l) => l;
  const rotr32L = (h, _l) => h;
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
  const add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
  const B2B_IV = /* @__PURE__ */ Uint32Array.from([
    4089235720,
    1779033703,
    2227873595,
    3144134277,
    4271175723,
    1013904242,
    1595750129,
    2773480762,
    2917565137,
    1359893119,
    725511199,
    2600822924,
    4215389547,
    528734635,
    327033209,
    1541459225
  ]);
  const BBUF = /* @__PURE__ */ new Uint32Array(32);
  function G1b(a, b, c, d, msg, x) {
    const Xl = msg[x], Xh = msg[x + 1];
    let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
    let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
    let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
    let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
    let ll = add3L(Al, Bl, Xl);
    Ah = add3H(ll, Ah, Bh, Xh);
    Al = ll | 0;
    ({ Dh, Dl } = { Dh: Dh ^ Ah, Dl: Dl ^ Al });
    ({ Dh, Dl } = { Dh: rotr32H(Dh, Dl), Dl: rotr32L(Dh) });
    ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
    ({ Bh, Bl } = { Bh: Bh ^ Ch, Bl: Bl ^ Cl });
    ({ Bh, Bl } = { Bh: rotrSH(Bh, Bl, 24), Bl: rotrSL(Bh, Bl, 24) });
    BBUF[2 * a] = Al, BBUF[2 * a + 1] = Ah;
    BBUF[2 * b] = Bl, BBUF[2 * b + 1] = Bh;
    BBUF[2 * c] = Cl, BBUF[2 * c + 1] = Ch;
    BBUF[2 * d] = Dl, BBUF[2 * d + 1] = Dh;
  }
  function G2b(a, b, c, d, msg, x) {
    const Xl = msg[x], Xh = msg[x + 1];
    let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
    let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
    let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
    let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
    let ll = add3L(Al, Bl, Xl);
    Ah = add3H(ll, Ah, Bh, Xh);
    Al = ll | 0;
    ({ Dh, Dl } = { Dh: Dh ^ Ah, Dl: Dl ^ Al });
    ({ Dh, Dl } = { Dh: rotrSH(Dh, Dl, 16), Dl: rotrSL(Dh, Dl, 16) });
    ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
    ({ Bh, Bl } = { Bh: Bh ^ Ch, Bl: Bl ^ Cl });
    ({ Bh, Bl } = { Bh: rotrBH(Bh, Bl, 63), Bl: rotrBL(Bh, Bl, 63) });
    BBUF[2 * a] = Al, BBUF[2 * a + 1] = Ah;
    BBUF[2 * b] = Bl, BBUF[2 * b + 1] = Bh;
    BBUF[2 * c] = Cl, BBUF[2 * c + 1] = Ch;
    BBUF[2 * d] = Dl, BBUF[2 * d + 1] = Dh;
  }
  function checkBlake2Opts(outputLen, opts = {}, keyLen, saltLen, persLen) {
    anumber(keyLen);
    if (outputLen < 0 || outputLen > keyLen)
      throw new Error("outputLen bigger than keyLen");
    const { key, salt, personalization } = opts;
    if (key !== void 0 && (key.length < 1 || key.length > keyLen))
      throw new Error("key length must be undefined or 1.." + keyLen);
    if (salt !== void 0 && salt.length !== saltLen)
      throw new Error("salt must be undefined or " + saltLen);
    if (personalization !== void 0 && personalization.length !== persLen)
      throw new Error("personalization must be undefined or " + persLen);
  }
  class BLAKE2 extends Hash {
    constructor(blockLen, outputLen) {
      super();
      this.finished = false;
      this.destroyed = false;
      this.length = 0;
      this.pos = 0;
      anumber(blockLen);
      anumber(outputLen);
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.buffer = new Uint8Array(blockLen);
      this.buffer32 = u32(this.buffer);
    }
    update(data) {
      aexists(this);
      data = toBytes(data);
      abytes(data);
      const { blockLen, buffer, buffer32 } = this;
      const len = data.length;
      const offset = data.byteOffset;
      const buf = data.buffer;
      for (let pos = 0; pos < len; ) {
        if (this.pos === blockLen) {
          swap32IfBE(buffer32);
          this.compress(buffer32, 0, false);
          swap32IfBE(buffer32);
          this.pos = 0;
        }
        const take = Math.min(blockLen - this.pos, len - pos);
        const dataOffset = offset + pos;
        if (take === blockLen && !(dataOffset % 4) && pos + take < len) {
          const data32 = new Uint32Array(buf, dataOffset, Math.floor((len - pos) / 4));
          swap32IfBE(data32);
          for (let pos32 = 0; pos + blockLen < len; pos32 += buffer32.length, pos += blockLen) {
            this.length += blockLen;
            this.compress(data32, pos32, false);
          }
          swap32IfBE(data32);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        this.length += take;
        pos += take;
      }
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      const { pos, buffer32 } = this;
      this.finished = true;
      clean(this.buffer.subarray(pos));
      swap32IfBE(buffer32);
      this.compress(buffer32, 0, true);
      swap32IfBE(buffer32);
      const out32 = u32(out);
      this.get().forEach((v, i) => out32[i] = swap8IfBE(v));
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      const { buffer, length, finished, destroyed, outputLen, pos } = this;
      to || (to = new this.constructor({ dkLen: outputLen }));
      to.set(...this.get());
      to.buffer.set(buffer);
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      to.outputLen = outputLen;
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  }
  class BLAKE2b extends BLAKE2 {
    constructor(opts = {}) {
      const olen = opts.dkLen === void 0 ? 64 : opts.dkLen;
      super(128, olen);
      this.v0l = B2B_IV[0] | 0;
      this.v0h = B2B_IV[1] | 0;
      this.v1l = B2B_IV[2] | 0;
      this.v1h = B2B_IV[3] | 0;
      this.v2l = B2B_IV[4] | 0;
      this.v2h = B2B_IV[5] | 0;
      this.v3l = B2B_IV[6] | 0;
      this.v3h = B2B_IV[7] | 0;
      this.v4l = B2B_IV[8] | 0;
      this.v4h = B2B_IV[9] | 0;
      this.v5l = B2B_IV[10] | 0;
      this.v5h = B2B_IV[11] | 0;
      this.v6l = B2B_IV[12] | 0;
      this.v6h = B2B_IV[13] | 0;
      this.v7l = B2B_IV[14] | 0;
      this.v7h = B2B_IV[15] | 0;
      checkBlake2Opts(olen, opts, 64, 16, 16);
      let { key, personalization, salt } = opts;
      let keyLength = 0;
      if (key !== void 0) {
        key = toBytes(key);
        keyLength = key.length;
      }
      this.v0l ^= this.outputLen | keyLength << 8 | 1 << 16 | 1 << 24;
      if (salt !== void 0) {
        salt = toBytes(salt);
        const slt = u32(salt);
        this.v4l ^= swap8IfBE(slt[0]);
        this.v4h ^= swap8IfBE(slt[1]);
        this.v5l ^= swap8IfBE(slt[2]);
        this.v5h ^= swap8IfBE(slt[3]);
      }
      if (personalization !== void 0) {
        personalization = toBytes(personalization);
        const pers = u32(personalization);
        this.v6l ^= swap8IfBE(pers[0]);
        this.v6h ^= swap8IfBE(pers[1]);
        this.v7l ^= swap8IfBE(pers[2]);
        this.v7h ^= swap8IfBE(pers[3]);
      }
      if (key !== void 0) {
        const tmp = new Uint8Array(this.blockLen);
        tmp.set(key);
        this.update(tmp);
      }
    }
    // prettier-ignore
    get() {
      let { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
      return [v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h];
    }
    // prettier-ignore
    set(v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h) {
      this.v0l = v0l | 0;
      this.v0h = v0h | 0;
      this.v1l = v1l | 0;
      this.v1h = v1h | 0;
      this.v2l = v2l | 0;
      this.v2h = v2h | 0;
      this.v3l = v3l | 0;
      this.v3h = v3h | 0;
      this.v4l = v4l | 0;
      this.v4h = v4h | 0;
      this.v5l = v5l | 0;
      this.v5h = v5h | 0;
      this.v6l = v6l | 0;
      this.v6h = v6h | 0;
      this.v7l = v7l | 0;
      this.v7h = v7h | 0;
    }
    compress(msg, offset, isLast) {
      this.get().forEach((v, i) => BBUF[i] = v);
      BBUF.set(B2B_IV, 16);
      let { h, l } = fromBig(BigInt(this.length));
      BBUF[24] = B2B_IV[8] ^ l;
      BBUF[25] = B2B_IV[9] ^ h;
      if (isLast) {
        BBUF[28] = ~BBUF[28];
        BBUF[29] = ~BBUF[29];
      }
      let j = 0;
      const s = BSIGMA;
      for (let i = 0; i < 12; i++) {
        G1b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
        G2b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
        G1b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
        G2b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
        G1b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
        G2b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
        G1b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
        G2b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
        G1b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
        G2b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
        G1b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
        G2b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
        G1b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
        G2b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
        G1b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
        G2b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
      }
      this.v0l ^= BBUF[0] ^ BBUF[16];
      this.v0h ^= BBUF[1] ^ BBUF[17];
      this.v1l ^= BBUF[2] ^ BBUF[18];
      this.v1h ^= BBUF[3] ^ BBUF[19];
      this.v2l ^= BBUF[4] ^ BBUF[20];
      this.v2h ^= BBUF[5] ^ BBUF[21];
      this.v3l ^= BBUF[6] ^ BBUF[22];
      this.v3h ^= BBUF[7] ^ BBUF[23];
      this.v4l ^= BBUF[8] ^ BBUF[24];
      this.v4h ^= BBUF[9] ^ BBUF[25];
      this.v5l ^= BBUF[10] ^ BBUF[26];
      this.v5h ^= BBUF[11] ^ BBUF[27];
      this.v6l ^= BBUF[12] ^ BBUF[28];
      this.v6h ^= BBUF[13] ^ BBUF[29];
      this.v7l ^= BBUF[14] ^ BBUF[30];
      this.v7h ^= BBUF[15] ^ BBUF[31];
      clean(BBUF);
    }
    destroy() {
      this.destroyed = true;
      clean(this.buffer32);
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  const blake2b$1 = /* @__PURE__ */ createOptHasher((opts) => new BLAKE2b(opts));
  const blake2b = blake2b$1;
  function blake2AsU8a(data, bitLength = 256, key, onlyJs) {
    const byteLength = Math.ceil(bitLength / 8);
    const u8a = u8aToU8a(data);
    return !hasBigInt || !onlyJs && isReady() ? blake2b$2(u8a, u8aToU8a(key), byteLength) : key ? blake2b(u8a, { dkLen: byteLength, key }) : blake2b(u8a, { dkLen: byteLength });
  }
  const SS58_PREFIX = stringToU8a("SS58PRE");
  function sshash(key) {
    return blake2AsU8a(u8aConcat(SS58_PREFIX, key), 512);
  }
  function checkAddressChecksum(decoded) {
    const ss58Length = decoded[0] & 64 ? 2 : 1;
    const ss58Decoded = ss58Length === 1 ? decoded[0] : (decoded[0] & 63) << 2 | decoded[1] >> 6 | (decoded[1] & 63) << 8;
    const isPublicKey = [34 + ss58Length, 35 + ss58Length].includes(decoded.length);
    const length = decoded.length - (isPublicKey ? 2 : 1);
    const hash = sshash(decoded.subarray(0, length));
    const isValid = (decoded[0] & 128) === 0 && ![46, 47].includes(decoded[0]) && (isPublicKey ? decoded[decoded.length - 2] === hash[0] && decoded[decoded.length - 1] === hash[1] : decoded[decoded.length - 1] === hash[0]);
    return [isValid, length, ss58Length, ss58Decoded];
  }
  const knownSubstrate = [
    {
      "prefix": 0,
      "network": "polkadot",
      "displayName": "Polkadot Relay Chain",
      "symbols": [
        "DOT"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://polkadot.network"
    },
    {
      "prefix": 1,
      "network": "BareSr25519",
      "displayName": "Bare 32-bit Schnorr/Ristretto (S/R 25519) public key.",
      "symbols": [],
      "decimals": [],
      "standardAccount": "Sr25519",
      "website": null
    },
    {
      "prefix": 2,
      "network": "kusama",
      "displayName": "Kusama Relay Chain",
      "symbols": [
        "KSM"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://kusama.network"
    },
    {
      "prefix": 3,
      "network": "BareEd25519",
      "displayName": "Bare 32-bit Ed25519 public key.",
      "symbols": [],
      "decimals": [],
      "standardAccount": "Ed25519",
      "website": null
    },
    {
      "prefix": 4,
      "network": "katalchain",
      "displayName": "Katal Chain",
      "symbols": [],
      "decimals": [],
      "standardAccount": "*25519",
      "website": null
    },
    {
      "prefix": 5,
      "network": "astar",
      "displayName": "Astar Network",
      "symbols": [
        "ASTR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://astar.network"
    },
    {
      "prefix": 6,
      "network": "bifrost",
      "displayName": "Bifrost",
      "symbols": [
        "BNC"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://bifrost.finance/"
    },
    {
      "prefix": 7,
      "network": "edgeware",
      "displayName": "Edgeware",
      "symbols": [
        "EDG"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://edgewa.re"
    },
    {
      "prefix": 8,
      "network": "karura",
      "displayName": "Karura",
      "symbols": [
        "KAR"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://karura.network/"
    },
    {
      "prefix": 9,
      "network": "reynolds",
      "displayName": "Laminar Reynolds Canary",
      "symbols": [
        "REY"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "http://laminar.network/"
    },
    {
      "prefix": 10,
      "network": "acala",
      "displayName": "Acala",
      "symbols": [
        "ACA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://acala.network/"
    },
    {
      "prefix": 11,
      "network": "laminar",
      "displayName": "Laminar",
      "symbols": [
        "LAMI"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "http://laminar.network/"
    },
    {
      "prefix": 12,
      "network": "polymesh",
      "displayName": "Polymesh",
      "symbols": [
        "POLYX"
      ],
      "decimals": [
        6
      ],
      "standardAccount": "*25519",
      "website": "https://polymath.network/"
    },
    {
      "prefix": 13,
      "network": "integritee",
      "displayName": "Integritee",
      "symbols": [
        "TEER"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://integritee.network"
    },
    {
      "prefix": 14,
      "network": "totem",
      "displayName": "Totem",
      "symbols": [
        "TOTEM"
      ],
      "decimals": [
        0
      ],
      "standardAccount": "*25519",
      "website": "https://totemaccounting.com"
    },
    {
      "prefix": 15,
      "network": "synesthesia",
      "displayName": "Synesthesia",
      "symbols": [
        "SYN"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://synesthesia.network/"
    },
    {
      "prefix": 16,
      "network": "kulupu",
      "displayName": "Kulupu",
      "symbols": [
        "KLP"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://kulupu.network/"
    },
    {
      "prefix": 17,
      "network": "dark",
      "displayName": "Dark Mainnet",
      "symbols": [],
      "decimals": [],
      "standardAccount": "*25519",
      "website": null
    },
    {
      "prefix": 18,
      "network": "darwinia",
      "displayName": "Darwinia Network",
      "symbols": [
        "RING"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "secp256k1",
      "website": "https://darwinia.network"
    },
    {
      "prefix": 19,
      "network": "watr",
      "displayName": "Watr Protocol",
      "symbols": [
        "WATR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://www.watr.org"
    },
    {
      "prefix": 20,
      "network": "stafi",
      "displayName": "Stafi",
      "symbols": [
        "FIS"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://stafi.io"
    },
    {
      "prefix": 21,
      "network": "karmachain",
      "displayName": "Karmacoin",
      "symbols": [
        "KCOIN"
      ],
      "decimals": [
        6
      ],
      "standardAccount": "*25519",
      "website": "https://karmaco.in"
    },
    {
      "prefix": 22,
      "network": "dock-pos-mainnet",
      "displayName": "Dock Mainnet",
      "symbols": [
        "DCK"
      ],
      "decimals": [
        6
      ],
      "standardAccount": "*25519",
      "website": "https://dock.io"
    },
    {
      "prefix": 23,
      "network": "shift",
      "displayName": "ShiftNrg",
      "symbols": [],
      "decimals": [],
      "standardAccount": "*25519",
      "website": null
    },
    {
      "prefix": 24,
      "network": "zero",
      "displayName": "ZERO",
      "symbols": [
        "ZERO"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://zero.io"
    },
    {
      "prefix": 25,
      "network": "zero-alphaville",
      "displayName": "ZERO Alphaville",
      "symbols": [
        "ZERO"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://zero.io"
    },
    {
      "prefix": 26,
      "network": "jupiter",
      "displayName": "Jupiter",
      "symbols": [
        "jDOT"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://jupiter.patract.io"
    },
    {
      "prefix": 27,
      "network": "kabocha",
      "displayName": "Kabocha",
      "symbols": [
        "KAB"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://kabocha.network"
    },
    {
      "prefix": 28,
      "network": "subsocial",
      "displayName": "Subsocial",
      "symbols": [],
      "decimals": [],
      "standardAccount": "*25519",
      "website": null
    },
    {
      "prefix": 29,
      "network": "cord",
      "displayName": "CORD Network",
      "symbols": [
        "DHI",
        "WAY"
      ],
      "decimals": [
        12,
        12
      ],
      "standardAccount": "*25519",
      "website": "https://cord.network/"
    },
    {
      "prefix": 30,
      "network": "phala",
      "displayName": "Phala Network",
      "symbols": [
        "PHA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://phala.network"
    },
    {
      "prefix": 31,
      "network": "litentry",
      "displayName": "Litentry Network",
      "symbols": [
        "LIT"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://litentry.com/"
    },
    {
      "prefix": 32,
      "network": "robonomics",
      "displayName": "Robonomics",
      "symbols": [
        "XRT"
      ],
      "decimals": [
        9
      ],
      "standardAccount": "*25519",
      "website": "https://robonomics.network"
    },
    {
      "prefix": 33,
      "network": "datahighway",
      "displayName": "DataHighway",
      "symbols": [],
      "decimals": [],
      "standardAccount": "*25519",
      "website": null
    },
    {
      "prefix": 34,
      "network": "ares",
      "displayName": "Ares Protocol",
      "symbols": [
        "ARES"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://www.aresprotocol.com/"
    },
    {
      "prefix": 35,
      "network": "vln",
      "displayName": "Valiu Liquidity Network",
      "symbols": [
        "USDv"
      ],
      "decimals": [
        15
      ],
      "standardAccount": "*25519",
      "website": "https://valiu.com/"
    },
    {
      "prefix": 36,
      "network": "centrifuge",
      "displayName": "Centrifuge Chain",
      "symbols": [
        "CFG"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://centrifuge.io/"
    },
    {
      "prefix": 37,
      "network": "nodle",
      "displayName": "Nodle Chain",
      "symbols": [
        "NODL"
      ],
      "decimals": [
        11
      ],
      "standardAccount": "*25519",
      "website": "https://nodle.io/"
    },
    {
      "prefix": 38,
      "network": "kilt",
      "displayName": "KILT Spiritnet",
      "symbols": [
        "KILT"
      ],
      "decimals": [
        15
      ],
      "standardAccount": "*25519",
      "website": "https://kilt.io/"
    },
    {
      "prefix": 39,
      "network": "mathchain",
      "displayName": "MathChain mainnet",
      "symbols": [
        "MATH"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://mathwallet.org"
    },
    {
      "prefix": 40,
      "network": "mathchain-testnet",
      "displayName": "MathChain testnet",
      "symbols": [
        "MATH"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://mathwallet.org"
    },
    {
      "prefix": 41,
      "network": "polimec",
      "displayName": "Polimec Protocol",
      "symbols": [
        "PLMC"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://www.polimec.org/"
    },
    {
      "prefix": 42,
      "network": "substrate",
      "displayName": "Substrate",
      "symbols": [],
      "decimals": [],
      "standardAccount": "*25519",
      "website": "https://substrate.io/"
    },
    {
      "prefix": 43,
      "network": "BareSecp256k1",
      "displayName": "Bare 32-bit ECDSA SECP-256k1 public key.",
      "symbols": [],
      "decimals": [],
      "standardAccount": "secp256k1",
      "website": null
    },
    {
      "prefix": 44,
      "network": "chainx",
      "displayName": "ChainX",
      "symbols": [
        "PCX"
      ],
      "decimals": [
        8
      ],
      "standardAccount": "*25519",
      "website": "https://chainx.org/"
    },
    {
      "prefix": 45,
      "network": "uniarts",
      "displayName": "UniArts Network",
      "symbols": [
        "UART",
        "UINK"
      ],
      "decimals": [
        12,
        12
      ],
      "standardAccount": "*25519",
      "website": "https://uniarts.me"
    },
    {
      "prefix": 46,
      "network": "reserved46",
      "displayName": "This prefix is reserved.",
      "symbols": [],
      "decimals": [],
      "standardAccount": null,
      "website": null
    },
    {
      "prefix": 47,
      "network": "reserved47",
      "displayName": "This prefix is reserved.",
      "symbols": [],
      "decimals": [],
      "standardAccount": null,
      "website": null
    },
    {
      "prefix": 48,
      "network": "neatcoin",
      "displayName": "Neatcoin Mainnet",
      "symbols": [
        "NEAT"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://neatcoin.org"
    },
    {
      "prefix": 49,
      "network": "picasso",
      "displayName": "Picasso",
      "symbols": [
        "PICA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://picasso.composable.finance"
    },
    {
      "prefix": 50,
      "network": "composable",
      "displayName": "Composable Finance",
      "symbols": [
        "LAYR"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://composable.finance"
    },
    {
      "prefix": 51,
      "network": "oak",
      "displayName": "OAK Network",
      "symbols": [
        "OAK",
        "TUR"
      ],
      "decimals": [
        10,
        10
      ],
      "standardAccount": "*25519",
      "website": "https://oak.tech"
    },
    {
      "prefix": 52,
      "network": "KICO",
      "displayName": "KICO",
      "symbols": [
        "KICO"
      ],
      "decimals": [
        14
      ],
      "standardAccount": "*25519",
      "website": "https://dico.io"
    },
    {
      "prefix": 53,
      "network": "DICO",
      "displayName": "DICO",
      "symbols": [
        "DICO"
      ],
      "decimals": [
        14
      ],
      "standardAccount": "*25519",
      "website": "https://dico.io"
    },
    {
      "prefix": 54,
      "network": "cere",
      "displayName": "Cere Network",
      "symbols": [
        "CERE"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://cere.network"
    },
    {
      "prefix": 55,
      "network": "xxnetwork",
      "displayName": "xx network",
      "symbols": [
        "XX"
      ],
      "decimals": [
        9
      ],
      "standardAccount": "*25519",
      "website": "https://xx.network"
    },
    {
      "prefix": 56,
      "network": "pendulum",
      "displayName": "Pendulum chain",
      "symbols": [
        "PEN"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://pendulumchain.org/"
    },
    {
      "prefix": 57,
      "network": "amplitude",
      "displayName": "Amplitude chain",
      "symbols": [
        "AMPE"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://pendulumchain.org/"
    },
    {
      "prefix": 58,
      "network": "eternal-civilization",
      "displayName": "Eternal Civilization",
      "symbols": [
        "ECC"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "http://www.ysknfr.cn/"
    },
    {
      "prefix": 63,
      "network": "hydradx",
      "displayName": "Hydration",
      "symbols": [
        "HDX"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://hydration.net"
    },
    {
      "prefix": 65,
      "network": "aventus",
      "displayName": "Aventus Mainnet",
      "symbols": [
        "AVT"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://aventus.io"
    },
    {
      "prefix": 66,
      "network": "crust",
      "displayName": "Crust Network",
      "symbols": [
        "CRU"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://crust.network"
    },
    {
      "prefix": 67,
      "network": "genshiro",
      "displayName": "Genshiro Network",
      "symbols": [
        "GENS",
        "EQD",
        "LPT0"
      ],
      "decimals": [
        9,
        9,
        9
      ],
      "standardAccount": "*25519",
      "website": "https://genshiro.equilibrium.io"
    },
    {
      "prefix": 68,
      "network": "equilibrium",
      "displayName": "Equilibrium Network",
      "symbols": [
        "EQ"
      ],
      "decimals": [
        9
      ],
      "standardAccount": "*25519",
      "website": "https://equilibrium.io"
    },
    {
      "prefix": 69,
      "network": "sora",
      "displayName": "SORA Network",
      "symbols": [
        "XOR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://sora.org"
    },
    {
      "prefix": 71,
      "network": "p3d",
      "displayName": "3DP network",
      "symbols": [
        "P3D"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://3dpass.org"
    },
    {
      "prefix": 72,
      "network": "p3dt",
      "displayName": "3DP test network",
      "symbols": [
        "P3Dt"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://3dpass.org"
    },
    {
      "prefix": 73,
      "network": "zeitgeist",
      "displayName": "Zeitgeist",
      "symbols": [
        "ZTG"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://zeitgeist.pm"
    },
    {
      "prefix": 77,
      "network": "manta",
      "displayName": "Manta network",
      "symbols": [
        "MANTA"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://manta.network"
    },
    {
      "prefix": 78,
      "network": "calamari",
      "displayName": "Calamari: Manta Canary Network",
      "symbols": [
        "KMA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://manta.network"
    },
    {
      "prefix": 81,
      "network": "sora_dot_para",
      "displayName": "SORA Polkadot Parachain",
      "symbols": [
        "XOR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://sora.org"
    },
    {
      "prefix": 88,
      "network": "polkadex",
      "displayName": "Polkadex Mainnet",
      "symbols": [
        "PDEX"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://polkadex.trade"
    },
    {
      "prefix": 89,
      "network": "polkadexparachain",
      "displayName": "Polkadex Parachain",
      "symbols": [
        "PDEX"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://polkadex.trade"
    },
    {
      "prefix": 90,
      "network": "frequency",
      "displayName": "Frequency",
      "symbols": [
        "FRQCY"
      ],
      "decimals": [
        8
      ],
      "standardAccount": "*25519",
      "website": "https://www.frequency.xyz"
    },
    {
      "prefix": 92,
      "network": "anmol",
      "displayName": "Anmol Network",
      "symbols": [
        "ANML"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://anmol.network/"
    },
    {
      "prefix": 93,
      "network": "fragnova",
      "displayName": "Fragnova Network",
      "symbols": [
        "NOVA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://fragnova.com"
    },
    {
      "prefix": 98,
      "network": "polkasmith",
      "displayName": "PolkaSmith Canary Network",
      "symbols": [
        "PKS"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://polkafoundry.com"
    },
    {
      "prefix": 99,
      "network": "polkafoundry",
      "displayName": "PolkaFoundry Network",
      "symbols": [
        "PKF"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://polkafoundry.com"
    },
    {
      "prefix": 100,
      "network": "ibtida",
      "displayName": "Anmol Network Ibtida Canary network",
      "symbols": [
        "IANML"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://anmol.network/"
    },
    {
      "prefix": 101,
      "network": "origintrail-parachain",
      "displayName": "OriginTrail Parachain",
      "symbols": [
        "OTP"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://parachain.origintrail.io/"
    },
    {
      "prefix": 105,
      "network": "pontem-network",
      "displayName": "Pontem Network",
      "symbols": [
        "PONT"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://pontem.network"
    },
    {
      "prefix": 110,
      "network": "heiko",
      "displayName": "Heiko",
      "symbols": [
        "HKO"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://parallel.fi/"
    },
    {
      "prefix": 113,
      "network": "integritee-incognito",
      "displayName": "Integritee Incognito",
      "symbols": [],
      "decimals": [],
      "standardAccount": "*25519",
      "website": "https://integritee.network"
    },
    {
      "prefix": 117,
      "network": "tinker",
      "displayName": "Tinker",
      "symbols": [
        "TNKR"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://invarch.network"
    },
    {
      "prefix": 126,
      "network": "joystream",
      "displayName": "Joystream",
      "symbols": [
        "JOY"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://www.joystream.org"
    },
    {
      "prefix": 128,
      "network": "clover",
      "displayName": "Clover Finance",
      "symbols": [
        "CLV"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://clover.finance"
    },
    {
      "prefix": 129,
      "network": "dorafactory-polkadot",
      "displayName": "Dorafactory Polkadot Network",
      "symbols": [
        "DORA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://dorafactory.org"
    },
    {
      "prefix": 131,
      "network": "litmus",
      "displayName": "Litmus Network",
      "symbols": [
        "LIT"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://litentry.com/"
    },
    {
      "prefix": 136,
      "network": "altair",
      "displayName": "Altair",
      "symbols": [
        "AIR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://centrifuge.io/"
    },
    {
      "prefix": 137,
      "network": "vara",
      "displayName": "Vara Network",
      "symbols": [
        "VARA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://vara.network/"
    },
    {
      "prefix": 172,
      "network": "parallel",
      "displayName": "Parallel",
      "symbols": [
        "PARA"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://parallel.fi/"
    },
    {
      "prefix": 252,
      "network": "social-network",
      "displayName": "Social Network",
      "symbols": [
        "NET"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://social.network"
    },
    {
      "prefix": 255,
      "network": "quartz_mainnet",
      "displayName": "QUARTZ by UNIQUE",
      "symbols": [
        "QTZ"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://unique.network"
    },
    {
      "prefix": 268,
      "network": "pioneer_network",
      "displayName": "Pioneer Network by Bit.Country",
      "symbols": [
        "NEER"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://bit.country"
    },
    {
      "prefix": 420,
      "network": "sora_kusama_para",
      "displayName": "SORA Kusama Parachain",
      "symbols": [
        "XOR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://sora.org"
    },
    {
      "prefix": 440,
      "network": "allfeat_network",
      "displayName": "Allfeat Network",
      "symbols": [
        "AFT"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://allfeat.network"
    },
    {
      "prefix": 666,
      "network": "metaquity_network",
      "displayName": "Metaquity Network",
      "symbols": [
        "MQTY"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://metaquity.xyz/"
    },
    {
      "prefix": 777,
      "network": "curio",
      "displayName": "Curio",
      "symbols": [
        "CGT"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://parachain.capitaldex.exchange/"
    },
    {
      "prefix": 789,
      "network": "geek",
      "displayName": "GEEK Network",
      "symbols": [
        "GEEK"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://geek.gl"
    },
    {
      "prefix": 995,
      "network": "ternoa",
      "displayName": "Ternoa",
      "symbols": [
        "CAPS"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://www.ternoa.network"
    },
    {
      "prefix": 1110,
      "network": "efinity",
      "displayName": "Efinity",
      "symbols": [
        "EFI"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://efinity.io/"
    },
    {
      "prefix": 1221,
      "network": "peaq",
      "displayName": "Peaq Network",
      "symbols": [
        "PEAQ"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "Sr25519",
      "website": "https://www.peaq.network/"
    },
    {
      "prefix": 1222,
      "network": "krest",
      "displayName": "Krest Network",
      "symbols": [
        "KREST"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "Sr25519",
      "website": "https://www.peaq.network/"
    },
    {
      "prefix": 1284,
      "network": "moonbeam",
      "displayName": "Moonbeam",
      "symbols": [
        "GLMR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "secp256k1",
      "website": "https://moonbeam.network"
    },
    {
      "prefix": 1285,
      "network": "moonriver",
      "displayName": "Moonriver",
      "symbols": [
        "MOVR"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "secp256k1",
      "website": "https://moonbeam.network"
    },
    {
      "prefix": 1328,
      "network": "ajuna",
      "displayName": "Ajuna Network",
      "symbols": [
        "AJUN"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://ajuna.io"
    },
    {
      "prefix": 1337,
      "network": "bajun",
      "displayName": "Bajun Network",
      "symbols": [
        "BAJU"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://ajuna.io"
    },
    {
      "prefix": 1516,
      "network": "societal",
      "displayName": "Societal",
      "symbols": [
        "SCTL"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://www.sctl.xyz"
    },
    {
      "prefix": 1985,
      "network": "seals",
      "displayName": "Seals Network",
      "symbols": [
        "SEAL"
      ],
      "decimals": [
        9
      ],
      "standardAccount": "*25519",
      "website": "https://seals.app"
    },
    {
      "prefix": 2007,
      "network": "kapex",
      "displayName": "Kapex",
      "symbols": [
        "KAPEX"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://totemaccounting.com"
    },
    {
      "prefix": 2009,
      "network": "cloudwalk_mainnet",
      "displayName": "CloudWalk Network Mainnet",
      "symbols": [
        "CWN"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://explorer.mainnet.cloudwalk.io"
    },
    {
      "prefix": 2021,
      "network": "logion",
      "displayName": "logion network",
      "symbols": [
        "LGNT"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://logion.network"
    },
    {
      "prefix": 2024,
      "network": "vow-chain",
      "displayName": "Enigmatic Smile",
      "symbols": [
        "VOW"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://www.vow.foundation/"
    },
    {
      "prefix": 2032,
      "network": "interlay",
      "displayName": "Interlay",
      "symbols": [
        "INTR"
      ],
      "decimals": [
        10
      ],
      "standardAccount": "*25519",
      "website": "https://interlay.io/"
    },
    {
      "prefix": 2092,
      "network": "kintsugi",
      "displayName": "Kintsugi",
      "symbols": [
        "KINT"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://interlay.io/"
    },
    {
      "prefix": 2106,
      "network": "bitgreen",
      "displayName": "Bitgreen",
      "symbols": [
        "BBB"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://bitgreen.org/"
    },
    {
      "prefix": 2112,
      "network": "chainflip",
      "displayName": "Chainflip",
      "symbols": [
        "FLIP"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://chainflip.io/"
    },
    {
      "prefix": 2199,
      "network": "moonsama",
      "displayName": "Moonsama",
      "symbols": [
        "SAMA"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "secp256k1",
      "website": "https://moonsama.com"
    },
    {
      "prefix": 2206,
      "network": "ICE",
      "displayName": "ICE Network",
      "symbols": [
        "ICY"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://icenetwork.io"
    },
    {
      "prefix": 2207,
      "network": "SNOW",
      "displayName": "SNOW: ICE Canary Network",
      "symbols": [
        "ICZ"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://icenetwork.io"
    },
    {
      "prefix": 2254,
      "network": "subspace_testnet",
      "displayName": "Subspace testnet",
      "symbols": [
        "tSSC"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://subspace.network"
    },
    {
      "prefix": 3333,
      "network": "peerplays",
      "displayName": "Peerplays",
      "symbols": [
        "PPY"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "secp256k1",
      "website": "https://www.peerplays.com/"
    },
    {
      "prefix": 4450,
      "network": "g1",
      "displayName": "Ğ1",
      "symbols": [
        "G1"
      ],
      "decimals": [
        2
      ],
      "standardAccount": "*25519",
      "website": "https://duniter.org"
    },
    {
      "prefix": 5234,
      "network": "humanode",
      "displayName": "Humanode Network",
      "symbols": [
        "HMND"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://humanode.io"
    },
    {
      "prefix": 5845,
      "network": "tangle",
      "displayName": "Tangle Network",
      "symbols": [
        "TNT"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://www.tangle.tools/"
    },
    {
      "prefix": 6094,
      "network": "autonomys",
      "displayName": "Autonomys",
      "symbols": [
        "AI3"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://autonomys.xyz"
    },
    {
      "prefix": 7007,
      "network": "tidefi",
      "displayName": "Tidefi",
      "symbols": [
        "TDFY"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://tidefi.com"
    },
    {
      "prefix": 7013,
      "network": "gm",
      "displayName": "GM",
      "symbols": [
        "FREN",
        "GM",
        "GN"
      ],
      "decimals": [
        12,
        0,
        0
      ],
      "standardAccount": "*25519",
      "website": "https://gmordie.com"
    },
    {
      "prefix": 7306,
      "network": "krigan",
      "displayName": "Krigan Network",
      "symbols": [
        "KRGN"
      ],
      "decimals": [
        9
      ],
      "standardAccount": "*25519",
      "website": "https://krigan.network"
    },
    {
      "prefix": 7391,
      "network": "unique_mainnet",
      "displayName": "Unique Network",
      "symbols": [
        "UNQ"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://unique.network"
    },
    {
      "prefix": 8866,
      "network": "golden_gate",
      "displayName": "Golden Gate",
      "symbols": [
        "GGX"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://ggxchain.io/"
    },
    {
      "prefix": 8883,
      "network": "sapphire_mainnet",
      "displayName": "Sapphire by Unique",
      "symbols": [
        "QTZ"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://unique.network"
    },
    {
      "prefix": 8886,
      "network": "golden_gate_sydney",
      "displayName": "Golden Gate Sydney",
      "symbols": [
        "GGXT"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://ggxchain.io/"
    },
    {
      "prefix": 9072,
      "network": "hashed",
      "displayName": "Hashed Network",
      "symbols": [
        "HASH"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://hashed.network"
    },
    {
      "prefix": 9807,
      "network": "dentnet",
      "displayName": "DENTNet",
      "symbols": [
        "DENTX"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://www.dentnet.io"
    },
    {
      "prefix": 9935,
      "network": "t3rn",
      "displayName": "t3rn",
      "symbols": [
        "TRN"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://t3rn.io/"
    },
    {
      "prefix": 10041,
      "network": "basilisk",
      "displayName": "Basilisk",
      "symbols": [
        "BSX"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://bsx.fi"
    },
    {
      "prefix": 11330,
      "network": "cess-testnet",
      "displayName": "CESS Testnet",
      "symbols": [
        "TCESS"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://cess.cloud"
    },
    {
      "prefix": 11331,
      "network": "cess",
      "displayName": "CESS",
      "symbols": [
        "CESS"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://cess.cloud"
    },
    {
      "prefix": 11486,
      "network": "luhn",
      "displayName": "Luhn Network",
      "symbols": [
        "LUHN"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://luhn.network"
    },
    {
      "prefix": 11820,
      "network": "contextfree",
      "displayName": "Automata ContextFree",
      "symbols": [
        "CTX"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://ata.network"
    },
    {
      "prefix": 12155,
      "network": "impact",
      "displayName": "Impact Protocol Network",
      "symbols": [
        "BSTY"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://impactprotocol.network/"
    },
    {
      "prefix": 12191,
      "network": "nftmart",
      "displayName": "NFTMart",
      "symbols": [
        "NMT"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://nftmart.io"
    },
    {
      "prefix": 12850,
      "network": "analog-timechain",
      "displayName": "Analog Timechain",
      "symbols": [
        "ANLOG"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://analog.one"
    },
    {
      "prefix": 13116,
      "network": "bittensor",
      "displayName": "Bittensor",
      "symbols": [
        "TAO"
      ],
      "decimals": [
        9
      ],
      "standardAccount": "*25519",
      "website": "https://bittensor.com"
    },
    {
      "prefix": 14697,
      "network": "goro",
      "displayName": "GORO Network",
      "symbols": [
        "GORO"
      ],
      "decimals": [
        9
      ],
      "standardAccount": "*25519",
      "website": "https://goro.network"
    },
    {
      "prefix": 14998,
      "network": "mosaic-chain",
      "displayName": "Mosaic Chain",
      "symbols": [
        "MOS"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "*25519",
      "website": "https://mosaicchain.io"
    },
    {
      "prefix": 29972,
      "network": "mythos",
      "displayName": "Mythos",
      "symbols": [
        "MYTH"
      ],
      "decimals": [
        18
      ],
      "standardAccount": "secp256k1",
      "website": "https://mythos.foundation"
    },
    {
      "prefix": 8888,
      "network": "xcavate",
      "displayName": "Xcavate Protocol",
      "symbols": [
        "XCAV"
      ],
      "decimals": [
        12
      ],
      "standardAccount": "*25519",
      "website": "https://xcavate.io/"
    }
  ];
  const knownGenesis = {
    acala: [
      "0xfc41b9bd8ef8fe53d58c7ea67c794c7ec9a73daf05e6d54b14ff6342c99ba64c"
    ],
    ajuna: [
      "0xe358eb1d11b31255a286c12e44fe6780b7edb171d657905a97e39f71d9c6c3ee"
    ],
    "aleph-node": [
      "0x70255b4d28de0fc4e1a193d7e175ad1ccef431598211c55538f1018651a0344e"
    ],
    astar: [
      "0x9eb76c5184c4ab8679d2d5d819fdf90b9c001403e9e17da2e14b6d8aec4029c6"
    ],
    basilisk: [
      "0xa85cfb9b9fd4d622a5b28289a02347af987d8f73fa3108450e2b4a11c1ce5755"
    ],
    bifrost: [
      "0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b"
    ],
    "bifrost-kusama": [
      "0x9f28c6a68e0fc9646eff64935684f6eeeece527e37bbe1f213d22caa1d9d6bed"
    ],
    bittensor: [
      "0x2f0555cc76fc2840a25a6ea3b9637146806f1f44b090c175ffde2a7e5ab36c03"
    ],
    centrifuge: [
      "0xb3db41421702df9a7fcac62b53ffeac85f7853cc4e689e0b93aeb3db18c09d82",
      "0x67dddf2673b69e5f875f6f25277495834398eafd67f492e09f3f3345e003d1b5"
    ],
    cere: [
      "0x81443836a9a24caaa23f1241897d1235717535711d1d3fe24eae4fdc942c092c"
    ],
    composable: [
      "0xdaab8df776eb52ec604a5df5d388bb62a050a0aaec4556a64265b9d42755552d"
    ],
    creditcoin3: [
      "0x4436a7d64e363df85e065a894721002a86643283f9707338bf195d360ba2ee71",
      // cc3 mainnet
      "0xfc4ec97a1c1f119c4353aecb4a17c7c0cf7b40d5d660143d8bad9117e9866572",
      // cc3 testnet/drynet
      "0xfc9df99a665f964aed6649f275055e54df5e3420489538ed31d7788f53d11ef6"
      // cc3 devnet
    ],
    darwinia: [
      "0xe71578b37a7c799b0ab4ee87ffa6f059a6b98f71f06fb8c84a8d88013a548ad6"
    ],
    dentnet: [
      "0x0313f6a011d128d22f996703cbab05162e2fdc9e031493314fe6db79979c5ca7"
    ],
    "dock-mainnet": [
      "0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae",
      "0xf73467c6544aa68df2ee546b135f955c46b90fa627e9b5d7935f41061bb8a5a9"
    ],
    edgeware: [
      "0x742a2ca70c2fda6cee4f8df98d64c4c670a052d9568058982dad9d5a7a135c5b"
    ],
    encointer: [
      "0x7dd99936c1e9e6d1ce7d90eb6f33bea8393b4bf87677d675aa63c9cb3e8c5b5b"
    ],
    enjin: [
      "0xd8761d3c88f26dc12875c00d3165f7d67243d56fc85b4cf19937601a7916e5a9"
    ],
    equilibrium: [
      "0x6f1a800de3daff7f5e037ddf66ab22ce03ab91874debeddb1086f5f7dbd48925"
    ],
    frequency: [
      "0x4a587bf17a404e3572747add7aab7bbe56e805a5479c6c436f07f36fcc8d3ae1"
    ],
    genshiro: [
      "0x9b8cefc0eb5c568b527998bdd76c184e2b76ae561be76e4667072230217ea243"
    ],
    hydradx: [
      "0xafdc188f45c71dacbaa0b62e16a91f726c7b8699a9748cdf715459de6b7f366d",
      // Hydration | HydraDX Parachain
      "0xd2a620c27ec5cbc5621ff9a522689895074f7cca0d08e7134a7804e1a3ba86fc",
      // Snakenet Gen3-1
      "0x10af6e84234477d84dc572bac0789813b254aa490767ed06fb9591191d1073f9",
      // Snakenet Gen3
      "0x3d75507dd46301767e601265791da1d9cb47b6ebc94e87347b635e5bf58bd047",
      // Snakenet Gen2
      "0x0ed32bfcab4a83517fac88f2aa7cbc2f88d3ab93be9a12b6188a036bf8a943c2"
      // Snakenet Gen1
    ],
    integritee: [
      "0xcdedc8eadbfa209d3f207bba541e57c3c58a667b05a2e1d1e86353c9000758da",
      // on Kusama
      "0xe13e7af377c64e83f95e0d70d5e5c3c01d697a84538776c5b9bbe0e7d7b6034c"
      // on Polkadot
    ],
    "interlay-parachain": [
      "0xbf88efe70e9e0e916416e8bed61f2b45717f517d7f3523e33c7b001e5ffcbc72"
    ],
    karura: [
      "0xbaf5aabe40646d11f0ee8abbdc64f4a4b7674925cba08e4a05ff9ebed6e2126b"
    ],
    khala: [
      "0xd43540ba6d3eb4897c28a77d48cb5b729fea37603cbbfc7a86a73b72adb3be8d"
    ],
    kulupu: [
      "0xf7a99d3cb92853d00d5275c971c132c074636256583fee53b3bbe60d7b8769ba"
    ],
    kusama: [
      "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
      // Kusama CC3,
      "0xe3777fa922cafbff200cadeaea1a76bd7898ad5b89f7848999058b50e715f636",
      // Kusama CC2
      "0x3fd7b9eb6a00376e5be61f01abb429ffb0b104be05eaff4d458da48fcd425baf"
      // Kusama CC1
    ],
    liberland: [
      "0x6bd89e052d67a45bb60a9a23e8581053d5e0d619f15cb9865946937e690c42d6"
    ],
    matrixchain: [
      "0x3af4ff48ec76d2efc8476730f423ac07e25ad48f5f4c9dc39c778b164d808615"
    ],
    mythos: [
      "0xf6ee56e9c5277df5b4ce6ae9983ee88f3cbed27d31beeb98f9f84f997a1ab0b9"
    ],
    nodle: [
      "0x97da7ede98d7bad4e36b4d734b6055425a3be036da2a332ea5a7037656427a21"
    ],
    origintrail: [
      "0xe7e0962324a3b86c83404dbea483f25fb5dab4c224791c81b756cfc948006174"
    ],
    p3d: [
      "0x6c5894837ad89b6d92b114a2fb3eafa8fe3d26a54848e3447015442cd6ef4e66"
    ],
    parallel: [
      "0xe61a41c53f5dcd0beb09df93b34402aada44cb05117b71059cce40a2723a4e97"
    ],
    peaq: [
      "0xd2a5d385932d1f650dae03ef8e2748983779ee342c614f80854d32b8cd8fa48c"
    ],
    pendulum: [
      "0x5d3c298622d5634ed019bf61ea4b71655030015bde9beb0d6a24743714462c86"
    ],
    phala: [
      "0x1bb969d85965e4bb5a651abbedf21a54b6b31a21f66b5401cc3f1e286268d736"
    ],
    picasso: [
      "0x6811a339673c9daa897944dcdac99c6e2939cc88245ed21951a0a3c9a2be75bc",
      "0xe8e7f0f4c4f5a00720b4821dbfddefea7490bcf0b19009961cc46957984e2c1c"
    ],
    polimec: [
      "0x7eb9354488318e7549c722669dcbdcdc526f1fef1420e7944667212f3601fdbd"
    ],
    polkadex: [
      "0x3920bcb4960a1eef5580cd5367ff3f430eef052774f78468852f7b9cb39f8a3c"
    ],
    polkadot: [
      "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3"
    ],
    polymesh: [
      "0x6fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063"
    ],
    quartz: [
      "0xcd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554"
    ],
    rococo: [
      "0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e",
      "0xaaf2cd1b74b5f726895921259421b534124726263982522174147046b8827897",
      "0x037f5f3c8e67b314062025fc886fcd6238ea25a4a9b45dce8d246815c9ebe770",
      "0xc196f81260cf1686172b47a79cf002120735d7cb0eb1474e8adce56618456fff",
      "0xf6e9983c37baf68846fedafe21e56718790e39fb1c582abc408b81bc7b208f9a",
      "0x5fce687da39305dfe682b117f0820b319348e8bb37eb16cf34acbf6a202de9d9",
      "0xe7c3d5edde7db964317cd9b51a3a059d7cd99f81bdbce14990047354334c9779",
      "0x1611e1dbf0405379b861e2e27daa90f480b2e6d3682414a80835a52e8cb8a215",
      "0x343442f12fa715489a8714e79a7b264ea88c0d5b8c66b684a7788a516032f6b9",
      "0x78bcd530c6b3a068bc17473cf5d2aff9c287102bed9af3ae3c41c33b9d6c6147",
      "0x47381ee0697153d64404fc578392c8fd5cba9073391908f46c888498415647bd",
      "0x19c0e4fa8ab75f5ac7865e0b8f74ff91eb9a100d336f423cd013a8befba40299"
    ],
    sora: [
      "0x7e4e32d0feafd4f9c9414b0be86373f9a1efa904809b683453a9af6856d38ad5"
    ],
    stafi: [
      "0x290a4149f09ea0e402c74c1c7e96ae4239588577fe78932f94f5404c68243d80"
    ],
    statemine: [
      "0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a"
    ],
    statemint: [
      "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f"
    ],
    subsocial: [
      "0x0bd72c1c305172e1275278aaeb3f161e02eccb7a819e63f62d47bd53a28189f8"
    ],
    ternoa: [
      "0x6859c81ca95ef624c9dfe4dc6e3381c33e5d6509e35e147092bfbc780f777c4e"
    ],
    unique: [
      "0x84322d9cddbf35088f1e54e9a85c967a41a56a4f43445768125e61af166c7d31"
    ],
    vara: [
      "0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763"
    ],
    vtb: [
      "0x286bc8414c7000ce1d6ee6a834e29a54c1784814b76243eb77ed0b2c5573c60f",
      "0x7483b89572fb2bd687c7b9a93b242d0b237f9aba463aba07ec24503931038aaa"
    ],
    westend: [
      "0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e"
    ],
    xxnetwork: [
      "0x50dd5d206917bf10502c68fb4d18a59fc8aa31586f4e8856b493e43544aa82aa"
    ],
    zeitgeist: [
      "0x1bf2a2ecb4a868de66ea8610f2ce7c8c43706561b6476031315f6640fe38e060"
    ]
  };
  const knownIcon = {
    centrifuge: "polkadot",
    kusama: "polkadot",
    polkadot: "polkadot",
    sora: "polkadot",
    statemine: "polkadot",
    statemint: "polkadot",
    westmint: "polkadot"
  };
  const knownLedger = {
    acala: 787,
    ajuna: 354,
    "aleph-node": 643,
    astar: 810,
    bifrost: 788,
    "bifrost-kusama": 788,
    bittensor: 354,
    centrifuge: 747,
    composable: 354,
    creditcoin3: 354,
    darwinia: 354,
    dentnet: 734,
    "dock-mainnet": 594,
    edgeware: 523,
    encointer: 434,
    enjin: 1155,
    equilibrium: 99999997,
    frequency: 2091,
    genshiro: 99999996,
    hydradx: 354,
    integritee: 2015,
    "interlay-parachain": 354,
    karura: 686,
    khala: 434,
    kusama: 434,
    liberland: 767,
    matrixchain: 1155,
    mythos: 60,
    nodle: 1003,
    origintrail: 354,
    parallel: 354,
    peaq: 3338,
    pendulum: 354,
    phala: 354,
    picasso: 434,
    polimec: 3344,
    polkadex: 799,
    polkadot: 354,
    polymesh: 595,
    quartz: 631,
    sora: 617,
    stafi: 907,
    statemine: 434,
    // common-good on Kusama, shares derivation
    statemint: 354,
    // common-good on Polkadot, shares derivation
    ternoa: 995,
    unique: 661,
    vara: 4976,
    vtb: 694,
    xxnetwork: 1955,
    zeitgeist: 354
  };
  const knownTestnet = {
    "": true,
    // this is the default non-network entry
    "cess-testnet": true,
    "dock-testnet": true,
    jupiter: true,
    "mathchain-testnet": true,
    p3dt: true,
    subspace_testnet: true,
    "zero-alphaville": true
  };
  const UNSORTED = [0, 2, 42];
  const TESTNETS = ["testnet"];
  function toExpanded(o) {
    var _a, _b;
    const network = o.network || "";
    const nameParts = network.replace(/_/g, "-").split("-");
    const n = o;
    n.slip44 = knownLedger[network];
    n.hasLedgerSupport = !!n.slip44;
    n.genesisHash = knownGenesis[network] || [];
    n.icon = knownIcon[network] || "substrate";
    n.isTestnet = !!knownTestnet[network] || TESTNETS.includes(nameParts[nameParts.length - 1]);
    n.isIgnored = n.isTestnet || !(o.standardAccount && ((_a = o.decimals) == null ? void 0 : _a.length) && ((_b = o.symbols) == null ? void 0 : _b.length)) && o.prefix !== 42;
    return n;
  }
  function filterSelectable({ genesisHash, prefix }) {
    return !!genesisHash.length || prefix === 42;
  }
  function filterAvailable(n) {
    return !n.isIgnored && !!n.network;
  }
  function sortNetworks(a, b) {
    const isUnSortedA = UNSORTED.includes(a.prefix);
    const isUnSortedB = UNSORTED.includes(b.prefix);
    return isUnSortedA === isUnSortedB ? isUnSortedA ? 0 : a.displayName.localeCompare(b.displayName) : isUnSortedA ? -1 : 1;
  }
  const allNetworks = knownSubstrate.map(toExpanded);
  const availableNetworks = allNetworks.filter(filterAvailable).sort(sortNetworks);
  availableNetworks.filter(filterSelectable);
  const defaults = {
    allowedDecodedLengths: [1, 2, 4, 8, 32, 33],
    // publicKey has prefix + 2 checksum bytes, short only prefix + 1 checksum byte
    allowedEncodedLengths: [3, 4, 6, 10, 35, 36, 37, 38],
    allowedPrefix: availableNetworks.map(({ prefix }) => prefix),
    prefix: 42
  };
  function decodeAddress(encoded, ignoreChecksum, ss58Format = -1) {
    if (!encoded) {
      throw new Error("Invalid empty address passed");
    }
    if (isU8a(encoded) || isHex(encoded)) {
      return u8aToU8a(encoded);
    }
    try {
      const decoded = base58Decode(encoded);
      if (!defaults.allowedEncodedLengths.includes(decoded.length)) {
        throw new Error("Invalid decoded address length");
      }
      const [isValid, endPos, ss58Length, ss58Decoded] = checkAddressChecksum(decoded);
      if (!isValid && !ignoreChecksum) {
        throw new Error("Invalid decoded address checksum");
      } else if (ss58Format !== -1 && ss58Format !== ss58Decoded) {
        throw new Error(`Expected ss58Format ${ss58Format}, received ${ss58Decoded}`);
      }
      return decoded.slice(ss58Length, endPos);
    } catch (error) {
      throw new Error(`Decoding ${encoded}: ${error.message}`);
    }
  }
  function encodeAddress(key, ss58Format = defaults.prefix) {
    const u8a = decodeAddress(key);
    if (ss58Format < 0 || ss58Format > 16383 && !ss58Exceptions.includes(ss58Format) || [46, 47].includes(ss58Format)) {
      throw new Error("Out of range ss58Format specified");
    } else if (!defaults.allowedDecodedLengths.includes(u8a.length)) {
      throw new Error(`Expected a valid key to convert, with length ${defaults.allowedDecodedLengths.join(", ")}`);
    }
    const input = u8aConcat(ss58Format < 64 ? [ss58Format] : [
      (ss58Format & 252) >> 2 | 64,
      ss58Format >> 8 | (ss58Format & 3) << 6
    ], u8a);
    return base58Encode(u8aConcat(input, sshash(input).subarray(0, [32, 33].includes(u8a.length) ? 2 : 1)));
  }
  const ss58Exceptions = [29972];
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
    async updateDAOConfig(config2) {
      try {
        if (!authStore.state.isAuthenticated) {
          throw new Error("Not authenticated");
        }
        const apiService = ApiService.getInstance();
        await apiService.updateDAOConfig(config2);
        state$1.daoConfig = {
          name: config2.name,
          required_agreements: config2.required_agreements
        };
        state$1.teamMembers = config2.team_members;
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
  const _hoisted_1$f = { class: "wallet-connect" };
  const _hoisted_2$f = { class: "connect-header" };
  const _hoisted_3$f = { class: "connect-content" };
  const _hoisted_4$c = {
    key: 0,
    class: "step-content"
  };
  const _hoisted_5$c = { class: "wallet-options" };
  const _hoisted_6$b = {
    key: 0,
    class: "wallet-list"
  };
  const _hoisted_7$a = ["onClick", "disabled"];
  const _hoisted_8$a = { class: "wallet-icon" };
  const _hoisted_9$a = ["src", "alt"];
  const _hoisted_10$a = {
    class: "wallet-icon-fallback",
    style: { "display": "none" }
  };
  const _hoisted_11$9 = { class: "wallet-info" };
  const _hoisted_12$7 = { class: "wallet-name" };
  const _hoisted_13$6 = {
    key: 0,
    class: "loading-spinner"
  };
  const _hoisted_14$5 = {
    key: 1,
    class: "no-wallets"
  };
  const _hoisted_15$5 = { class: "extension-status" };
  const _hoisted_16$5 = {
    key: 0,
    class: "status-checking"
  };
  const _hoisted_17$5 = {
    key: 1,
    class: "status-not-found"
  };
  const _hoisted_18$5 = {
    key: 2,
    class: "status-found"
  };
  const _hoisted_19$5 = {
    key: 1,
    class: "step-content"
  };
  const _hoisted_20$5 = { class: "account-list" };
  const _hoisted_21$5 = ["onClick"];
  const _hoisted_22$5 = { class: "account-avatar" };
  const _hoisted_23$5 = { class: "account-info" };
  const _hoisted_24$5 = { class: "account-name" };
  const _hoisted_25$5 = { class: "account-address" };
  const _hoisted_26$5 = { class: "account-check" };
  const _hoisted_27$5 = { class: "step-actions" };
  const _hoisted_28$5 = ["disabled"];
  const _hoisted_29$5 = {
    key: 2,
    class: "step-content"
  };
  const _hoisted_30$5 = { class: "sign-message" };
  const _hoisted_31$5 = { class: "message-content" };
  const _hoisted_32$5 = { class: "step-actions" };
  const _hoisted_33$5 = ["disabled"];
  const _hoisted_34$5 = {
    key: 3,
    class: "error-message"
  };
  const _hoisted_35$5 = { class: "error-text" };
  const _sfc_main$f = /* @__PURE__ */ defineComponent({
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
        return openBlock(), createElementBlock("div", _hoisted_1$f, [
          createBaseVNode("div", _hoisted_2$f, [
            _cache[3] || (_cache[3] = createBaseVNode("h3", null, "Connect Wallet", -1)),
            createBaseVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close")),
              class: "close-btn"
            }, "✕")
          ]),
          createBaseVNode("div", _hoisted_3$f, [
            step.value === "select" ? (openBlock(), createElementBlock("div", _hoisted_4$c, [
              _cache[8] || (_cache[8] = createBaseVNode("div", { class: "step-description" }, " Choose your Polkadot wallet to connect: ", -1)),
              createBaseVNode("div", _hoisted_5$c, [
                availableWallets.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_6$b, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(availableWallets.value, (wallet) => {
                    return openBlock(), createElementBlock("div", {
                      key: wallet.key,
                      onClick: ($event) => connectToWallet(wallet.key),
                      class: "wallet-option",
                      disabled: isConnecting.value
                    }, [
                      createBaseVNode("div", _hoisted_8$a, [
                        createBaseVNode("img", {
                          src: getWalletIcon(wallet.key),
                          alt: wallet.name,
                          onError: handleIconError,
                          onerror: `this.style.display='none'; this.nextElementSibling.style.display='block'`
                        }, null, 40, _hoisted_9$a),
                        createBaseVNode("span", _hoisted_10$a, toDisplayString(getWalletEmoji(wallet.key)), 1)
                      ]),
                      createBaseVNode("div", _hoisted_11$9, [
                        createBaseVNode("div", _hoisted_12$7, toDisplayString(wallet.name), 1),
                        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "wallet-description" }, "Click to connect", -1))
                      ]),
                      isConnecting.value ? (openBlock(), createElementBlock("div", _hoisted_13$6)) : createCommentVNode("", true)
                    ], 8, _hoisted_7$a);
                  }), 128))
                ])) : (openBlock(), createElementBlock("div", _hoisted_14$5, [..._cache[5] || (_cache[5] = [
                  createBaseVNode("div", { class: "no-wallets-icon" }, "⚠️", -1),
                  createBaseVNode("div", { class: "no-wallets-text" }, "No wallet extensions found", -1)
                ])]))
              ]),
              createBaseVNode("div", _hoisted_15$5, [
                extensionStatus.value === "checking" ? (openBlock(), createElementBlock("div", _hoisted_16$5, " 🔍 Checking for Polkadot Extension... ")) : extensionStatus.value === "not-found" ? (openBlock(), createElementBlock("div", _hoisted_17$5, [
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
                ])) : extensionStatus.value === "found" ? (openBlock(), createElementBlock("div", _hoisted_18$5, " ✅ Polkadot Extension detected ")) : createCommentVNode("", true)
              ])
            ])) : createCommentVNode("", true),
            step.value === "accounts" ? (openBlock(), createElementBlock("div", _hoisted_19$5, [
              _cache[9] || (_cache[9] = createBaseVNode("div", { class: "step-description" }, " Select an account to connect: ", -1)),
              createBaseVNode("div", _hoisted_20$5, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(accounts.value, (account) => {
                  var _a, _b;
                  return openBlock(), createElementBlock("div", {
                    key: account.address,
                    onClick: ($event) => selectAccount(account),
                    class: normalizeClass(["account-item", { selected: ((_a = selectedAccount.value) == null ? void 0 : _a.address) === account.address }])
                  }, [
                    createBaseVNode("div", _hoisted_22$5, toDisplayString(getAccountInitials(account.name || account.address)), 1),
                    createBaseVNode("div", _hoisted_23$5, [
                      createBaseVNode("div", _hoisted_24$5, toDisplayString(account.name || "Unnamed Account"), 1),
                      createBaseVNode("div", _hoisted_25$5, toDisplayString(unref(formatAddress)(account.address)), 1)
                    ]),
                    createBaseVNode("div", _hoisted_26$5, toDisplayString(((_b = selectedAccount.value) == null ? void 0 : _b.address) === account.address ? "✓" : ""), 1)
                  ], 10, _hoisted_21$5);
                }), 128))
              ]),
              createBaseVNode("div", _hoisted_27$5, [
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => step.value = "select"),
                  class: "btn-secondary"
                }, "Back"),
                createBaseVNode("button", {
                  onClick: proceedToSign,
                  class: "btn-primary",
                  disabled: !selectedAccount.value
                }, " Continue ", 8, _hoisted_28$5)
              ])
            ])) : createCommentVNode("", true),
            step.value === "sign" ? (openBlock(), createElementBlock("div", _hoisted_29$5, [
              _cache[11] || (_cache[11] = createBaseVNode("div", { class: "step-description" }, " Sign the message to authenticate: ", -1)),
              createBaseVNode("div", _hoisted_30$5, [
                _cache[10] || (_cache[10] = createBaseVNode("div", { class: "message-label" }, "Message to sign:", -1)),
                createBaseVNode("div", _hoisted_31$5, toDisplayString(messageToSign.value), 1)
              ]),
              createBaseVNode("div", _hoisted_32$5, [
                createBaseVNode("button", {
                  onClick: _cache[2] || (_cache[2] = ($event) => step.value = "accounts"),
                  class: "btn-secondary"
                }, "Back"),
                createBaseVNode("button", {
                  onClick: handleSignMessage,
                  class: "btn-primary",
                  disabled: isSigning.value
                }, toDisplayString(isSigning.value ? "Signing..." : "Sign Message"), 9, _hoisted_33$5)
              ])
            ])) : createCommentVNode("", true),
            error.value ? (openBlock(), createElementBlock("div", _hoisted_34$5, [
              _cache[12] || (_cache[12] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)),
              createBaseVNode("div", _hoisted_35$5, toDisplayString(error.value), 1),
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
  const WalletConnect = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-4f7ca26e"]]);
  const _hoisted_1$e = { class: "modal-header" };
  const _hoisted_2$e = { class: "modal-content" };
  const _hoisted_3$e = { class: "config-sections" };
  const _hoisted_4$b = { class: "config-section" };
  const _hoisted_5$b = { class: "form-group" };
  const _hoisted_6$a = { class: "number-input-wrapper" };
  const _hoisted_7$9 = { class: "agreement-preview" };
  const _hoisted_8$9 = { class: "preview-bar" };
  const _hoisted_9$9 = { class: "progress-text" };
  const _hoisted_10$9 = { class: "modal-actions" };
  const _hoisted_11$8 = ["disabled"];
  const _sfc_main$e = /* @__PURE__ */ defineComponent({
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
            createBaseVNode("div", _hoisted_1$e, [
              _cache[5] || (_cache[5] = createBaseVNode("h3", null, "DAO Configuration", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$e, [
              createBaseVNode("div", _hoisted_3$e, [
                createBaseVNode("div", _hoisted_4$b, [
                  _cache[10] || (_cache[10] = createBaseVNode("h4", null, "Agreement Requirements", -1)),
                  createBaseVNode("div", _hoisted_5$b, [
                    _cache[7] || (_cache[7] = createBaseVNode("label", { for: "required-agreements" }, "Required Agreements", -1)),
                    createBaseVNode("div", _hoisted_6$a, [
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
                  createBaseVNode("div", _hoisted_7$9, [
                    _cache[9] || (_cache[9] = createBaseVNode("div", { class: "preview-label" }, "Preview:", -1)),
                    createBaseVNode("div", _hoisted_8$9, [
                      _cache[8] || (_cache[8] = createBaseVNode("div", { class: "progress-bar" }, [
                        createBaseVNode("div", {
                          class: "progress-fill",
                          style: { width: "60%" }
                        })
                      ], -1)),
                      createBaseVNode("div", _hoisted_9$9, toDisplayString(Math.ceil(requiredAgreements.value * 0.6)) + " / " + toDisplayString(requiredAgreements.value) + " agreements ", 1)
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_10$9, [
                createBaseVNode("button", {
                  class: "btn btn-secondary",
                  onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("close"))
                }, "Cancel"),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: handleSave,
                  disabled: requiredAgreements.value < 1
                }, " Save Configuration ", 8, _hoisted_11$8)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const DAOConfigModal = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-973fd79d"]]);
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
    async updateProposal(proposalId, updates) {
      const index = state.proposals.findIndex((p2) => p2.post_id.toString() === proposalId);
      if (index !== -1) {
        state.proposals[index] = __spreadProps(__spreadValues(__spreadValues({}, state.proposals[index]), updates), { updated_at: (/* @__PURE__ */ new Date()).toISOString() });
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
  const _hoisted_1$d = { class: "status-badge-container" };
  const _hoisted_2$d = ["title"];
  const _hoisted_3$d = { class: "status-text" };
  const _hoisted_4$a = {
    key: 0,
    class: "edit-icon"
  };
  const _hoisted_5$a = { class: "modal-content" };
  const _hoisted_6$9 = { class: "status-options" };
  const _hoisted_7$8 = { class: "status-grid" };
  const _hoisted_8$8 = ["onClick"];
  const _hoisted_9$8 = { class: "option-icon" };
  const _hoisted_10$8 = { class: "option-text" };
  const _hoisted_11$7 = { class: "reason-section" };
  const _hoisted_12$6 = { class: "modal-actions" };
  const _hoisted_13$5 = ["disabled"];
  const _sfc_main$d = /* @__PURE__ */ defineComponent({
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
        return openBlock(), createElementBlock("div", _hoisted_1$d, [
          createBaseVNode("div", {
            class: normalizeClass(["status-badge", statusClass.value]),
            onClick: handleClick,
            title: _ctx.editable ? "Click to change status" : _ctx.status
          }, [
            createBaseVNode("span", _hoisted_3$d, toDisplayString(_ctx.status), 1),
            _ctx.editable ? (openBlock(), createElementBlock("span", _hoisted_4$a, "edit")) : createCommentVNode("", true)
          ], 10, _hoisted_2$d),
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
              createBaseVNode("div", _hoisted_5$a, [
                createBaseVNode("p", null, [
                  _cache[3] || (_cache[3] = createBaseVNode("strong", null, "Proposal:", -1)),
                  createTextVNode(" #" + toDisplayString(_ctx.proposalId), 1)
                ]),
                createBaseVNode("p", null, [
                  _cache[4] || (_cache[4] = createBaseVNode("strong", null, "Current Status:", -1)),
                  createTextVNode(" " + toDisplayString(_ctx.status), 1)
                ]),
                createBaseVNode("div", _hoisted_6$9, [
                  _cache[5] || (_cache[5] = createBaseVNode("label", null, "New Status:", -1)),
                  createBaseVNode("div", _hoisted_7$8, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(statusOptions), (statusOption) => {
                      return openBlock(), createElementBlock("button", {
                        key: statusOption.value,
                        class: normalizeClass(["status-option", { selected: selectedStatus.value === statusOption.value }]),
                        onClick: ($event) => selectedStatus.value = statusOption.value
                      }, [
                        createBaseVNode("span", _hoisted_9$8, toDisplayString(statusOption.icon), 1),
                        createBaseVNode("span", _hoisted_10$8, toDisplayString(statusOption.value), 1)
                      ], 10, _hoisted_8$8);
                    }), 128))
                  ])
                ]),
                createBaseVNode("div", _hoisted_11$7, [
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
                createBaseVNode("div", _hoisted_12$6, [
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
  const StatusBadge = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-875347a1"]]);
  const _hoisted_1$c = { class: "modal-header" };
  const _hoisted_2$c = { class: "browser-content" };
  const _hoisted_3$c = { class: "filter-panel" };
  const _hoisted_4$9 = { class: "filter-section" };
  const _hoisted_5$9 = { class: "filter-group" };
  const _hoisted_6$8 = { class: "filter-group" };
  const _hoisted_7$7 = ["value"];
  const _hoisted_8$7 = { class: "filter-group" };
  const _hoisted_9$7 = ["value"];
  const _hoisted_10$7 = { class: "filter-group" };
  const _hoisted_11$6 = { class: "filter-group" };
  const _hoisted_12$5 = { class: "content-area" };
  const _hoisted_13$4 = { class: "view-controls" };
  const _hoisted_14$4 = { class: "view-modes" };
  const _hoisted_15$4 = { class: "sort-controls" };
  const _hoisted_16$4 = { class: "results-info" };
  const _hoisted_17$4 = {
    key: 0,
    class: "loading-state"
  };
  const _hoisted_18$4 = {
    key: 1,
    class: "empty-state"
  };
  const _hoisted_19$4 = { key: 2 };
  const _hoisted_20$4 = {
    key: 0,
    class: "proposals-list"
  };
  const _hoisted_21$4 = ["onClick"];
  const _hoisted_22$4 = { class: "proposal-id" };
  const _hoisted_23$4 = { class: "proposal-title" };
  const _hoisted_24$4 = { class: "proposal-status" };
  const _hoisted_25$4 = { class: "proposal-assignment" };
  const _hoisted_26$4 = ["onClick"];
  const _hoisted_27$4 = { class: "proposal-updated" };
  const _hoisted_28$4 = {
    key: 1,
    class: "proposals-cards"
  };
  const _hoisted_29$4 = ["onClick"];
  const _hoisted_30$4 = { class: "card-header" };
  const _hoisted_31$4 = { class: "proposal-id" };
  const _hoisted_32$4 = { class: "card-title" };
  const _hoisted_33$4 = { class: "card-meta" };
  const _hoisted_34$4 = { class: "meta-item" };
  const _hoisted_35$4 = { class: "meta-item" };
  const _hoisted_36$4 = {
    key: 0,
    class: "meta-item"
  };
  const _hoisted_37$4 = {
    key: 3,
    class: "pagination"
  };
  const _hoisted_38$4 = ["disabled"];
  const _hoisted_39$4 = { class: "page-info" };
  const _hoisted_40$4 = ["disabled"];
  const _sfc_main$c = /* @__PURE__ */ defineComponent({
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
            createBaseVNode("div", _hoisted_1$c, [
              _cache[14] || (_cache[14] = createBaseVNode("h2", null, "Browse Proposals", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$c, [
              createBaseVNode("div", _hoisted_3$c, [
                createBaseVNode("div", _hoisted_4$9, [
                  _cache[24] || (_cache[24] = createBaseVNode("h3", null, "Filters", -1)),
                  createBaseVNode("div", _hoisted_5$9, [
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
                  createBaseVNode("div", _hoisted_6$8, [
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
                        }, toDisplayString(status), 9, _hoisted_7$7);
                      }), 64))
                    ], 512), [
                      [vModelSelect, selectedInternalStatus.value]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_8$7, [
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
                        }, toDisplayString(status), 9, _hoisted_9$7);
                      }), 64))
                    ], 512), [
                      [vModelSelect, selectedTimelineStatus.value]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_10$7, [
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
                  createBaseVNode("div", _hoisted_11$6, [
                    _cache[23] || (_cache[23] = createBaseVNode("label", null, "My Team Action", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => selectedTeamAction.value = $event),
                      class: "filter-select"
                    }, [..._cache[22] || (_cache[22] = [
                      createStaticVNode('<option value="" data-v-05d5a52c>All Actions</option><option value="none" data-v-05d5a52c>No Action Taken</option><option value="Agree" data-v-05d5a52c>Agreed</option><option value="To be discussed" data-v-05d5a52c>To be Discussed</option><option value="NO WAY" data-v-05d5a52c>Vetoed</option><option value="Recuse" data-v-05d5a52c>Recused</option>', 6)
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
              createBaseVNode("div", _hoisted_12$5, [
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
                  createBaseVNode("div", _hoisted_15$4, [
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => sortBy.value = $event),
                      class: "sort-select"
                    }, [..._cache[25] || (_cache[25] = [
                      createStaticVNode('<option value="updated_at" data-v-05d5a52c>Last Updated</option><option value="created_at" data-v-05d5a52c>Created Date</option><option value="post_id" data-v-05d5a52c>Proposal ID</option><option value="title" data-v-05d5a52c>Title</option><option value="internal_status" data-v-05d5a52c>Status</option>', 5)
                    ])], 512), [
                      [vModelSelect, sortBy.value]
                    ]),
                    createBaseVNode("button", {
                      onClick: _cache[9] || (_cache[9] = ($event) => sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"),
                      class: "sort-order-btn"
                    }, toDisplayString(sortOrder.value === "asc" ? "↑" : "↓"), 1)
                  ]),
                  createBaseVNode("div", _hoisted_16$4, toDisplayString(filteredProposals2.value.length) + " of " + toDisplayString(unref(proposalStore).state.proposals.length) + " proposals ", 1)
                ]),
                createBaseVNode("div", {
                  class: normalizeClass(["proposals-container", viewMode.value])
                }, [
                  loading.value ? (openBlock(), createElementBlock("div", _hoisted_17$4, [..._cache[26] || (_cache[26] = [
                    createBaseVNode("div", { class: "spinner" }, null, -1),
                    createBaseVNode("p", null, "Loading proposals...", -1)
                  ])])) : filteredProposals2.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_18$4, [..._cache[27] || (_cache[27] = [
                    createBaseVNode("div", { class: "empty-icon" }, "📭", -1),
                    createBaseVNode("h3", null, "No proposals found", -1),
                    createBaseVNode("p", null, "Try adjusting your filters or search terms", -1)
                  ])])) : (openBlock(), createElementBlock("div", _hoisted_19$4, [
                    viewMode.value === "list" ? (openBlock(), createElementBlock("div", _hoisted_20$4, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(paginatedProposals.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_22$4, "#" + toDisplayString(proposal.post_id), 1),
                          createBaseVNode("div", _hoisted_23$4, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_24$4, [
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("div", _hoisted_25$4, [
                            createBaseVNode("span", null, toDisplayString(proposal.assigned_to || "Unassigned"), 1),
                            !proposal.assigned_to ? (openBlock(), createElementBlock("button", {
                              key: 0,
                              onClick: ($event) => assignToMe(proposal, $event),
                              class: "assign-btn"
                            }, " Assign to me ", 8, _hoisted_26$4)) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_27$4, toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                        ], 8, _hoisted_21$4);
                      }), 128))
                    ])) : createCommentVNode("", true),
                    viewMode.value === "cards" ? (openBlock(), createElementBlock("div", _hoisted_28$4, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(paginatedProposals.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-card",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_30$4, [
                            createBaseVNode("span", _hoisted_31$4, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_32$4, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_33$4, [
                            createBaseVNode("div", _hoisted_34$4, [
                              _cache[28] || (_cache[28] = createBaseVNode("strong", null, "Assigned:", -1)),
                              createTextVNode(" " + toDisplayString(unref(teamStore).getTeamMemberName(proposal.assigned_to) || unref(formatAddress)(proposal.assigned_to) || "Unassigned"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_35$4, [
                              _cache[29] || (_cache[29] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ]),
                            proposal.suggested_vote ? (openBlock(), createElementBlock("div", _hoisted_36$4, [
                              _cache[30] || (_cache[30] = createBaseVNode("strong", null, "Suggested:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.suggested_vote), 1)
                            ])) : createCommentVNode("", true)
                          ])
                        ], 8, _hoisted_29$4);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ])),
                  totalPages.value > 1 ? (openBlock(), createElementBlock("div", _hoisted_37$4, [
                    createBaseVNode("button", {
                      onClick: _cache[10] || (_cache[10] = ($event) => currentPage.value--),
                      disabled: currentPage.value === 1,
                      class: "page-btn"
                    }, " Previous ", 8, _hoisted_38$4),
                    createBaseVNode("span", _hoisted_39$4, " Page " + toDisplayString(currentPage.value) + " of " + toDisplayString(totalPages.value), 1),
                    createBaseVNode("button", {
                      onClick: _cache[11] || (_cache[11] = ($event) => currentPage.value++),
                      disabled: currentPage.value === totalPages.value,
                      class: "page-btn"
                    }, " Next ", 8, _hoisted_40$4)
                  ])) : createCommentVNode("", true)
                ], 2)
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const ProposalBrowser = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-05d5a52c"]]);
  const _hoisted_1$b = { class: "modal-header" };
  const _hoisted_2$b = { class: "dashboard-content" };
  const _hoisted_3$b = {
    key: 0,
    class: "auth-required"
  };
  const _hoisted_4$8 = { key: 1 };
  const _hoisted_5$8 = { class: "stats-section" };
  const _hoisted_6$7 = { class: "stats-section-container" };
  const _hoisted_7$6 = { class: "stat-number" };
  const _hoisted_8$6 = { class: "stat-number" };
  const _hoisted_9$6 = { class: "stat-number" };
  const _hoisted_10$6 = { class: "stat-number" };
  const _hoisted_11$5 = { class: "content-section" };
  const _hoisted_12$4 = {
    key: 0,
    class: "content-area"
  };
  const _hoisted_13$3 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_14$3 = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_15$3 = ["onClick"];
  const _hoisted_16$3 = { class: "proposal-header" };
  const _hoisted_17$3 = { class: "proposal-id" };
  const _hoisted_18$3 = { class: "proposal-title" };
  const _hoisted_19$3 = { class: "proposal-meta" };
  const _hoisted_20$3 = { class: "meta-item" };
  const _hoisted_21$3 = { class: "meta-item" };
  const _hoisted_22$3 = {
    key: 1,
    class: "content-area"
  };
  const _hoisted_23$3 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_24$3 = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_25$3 = ["onClick"];
  const _hoisted_26$3 = { class: "proposal-header" };
  const _hoisted_27$3 = { class: "proposal-id" };
  const _hoisted_28$3 = { class: "proposal-title" };
  const _hoisted_29$3 = { class: "action-required" };
  const _hoisted_30$3 = { class: "action-badge" };
  const _hoisted_31$3 = { class: "proposal-meta" };
  const _hoisted_32$3 = { class: "meta-item" };
  const _hoisted_33$3 = { class: "meta-item" };
  const _hoisted_34$3 = {
    key: 2,
    class: "content-area"
  };
  const _hoisted_35$3 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_36$3 = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_37$3 = ["onClick"];
  const _hoisted_38$3 = { class: "proposal-header" };
  const _hoisted_39$3 = { class: "proposal-id" };
  const _hoisted_40$3 = { class: "proposal-title" };
  const _hoisted_41$3 = { class: "evaluation-info" };
  const _hoisted_42$3 = {
    key: 0,
    class: "suggested-vote"
  };
  const _hoisted_43$3 = {
    key: 1,
    class: "vote-reason"
  };
  const _hoisted_44$3 = { class: "proposal-meta" };
  const _hoisted_45$3 = { class: "meta-item" };
  const _hoisted_46$3 = { class: "meta-item" };
  const _hoisted_47$3 = {
    key: 3,
    class: "content-area"
  };
  const _hoisted_48$3 = { class: "activity-summary" };
  const _hoisted_49$3 = { class: "activity-stats" };
  const _hoisted_50$3 = { class: "activity-stat" };
  const _hoisted_51$2 = { class: "stat-value" };
  const _hoisted_52$2 = { class: "activity-stat" };
  const _hoisted_53$2 = { class: "stat-value" };
  const _hoisted_54$2 = { class: "activity-stat" };
  const _hoisted_55$2 = { class: "stat-value" };
  const _hoisted_56$2 = { class: "recent-actions" };
  const _hoisted_57$2 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_58$2 = {
    key: 1,
    class: "activity-list"
  };
  const _hoisted_59$2 = { class: "activity-icon" };
  const _hoisted_60$1 = { class: "activity-details" };
  const _hoisted_61$1 = { class: "activity-description" };
  const _hoisted_62$1 = { class: "activity-time" };
  const _sfc_main$b = /* @__PURE__ */ defineComponent({
    __name: "MyDashboard",
    props: {
      show: { type: Boolean }
    },
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const emit2 = __emit;
      const loading = ref(false);
      const recentActivity = ref([]);
      const activeTab = ref("assignments");
      const dashboardProposals = ref([]);
      const currentUser = computed(() => {
        var _a;
        const address = (_a = authStore.state.user) == null ? void 0 : _a.address;
        return address || null;
      });
      const myAssignments2 = computed(() => {
        var _a;
        const currentUser2 = (_a = authStore.state.user) == null ? void 0 : _a.address;
        if (!currentUser2) return [];
        return dashboardProposals.value.filter((p2) => p2.assigned_to === currentUser2);
      });
      const actionsNeeded2 = computed(() => {
        var _a;
        const currentUser2 = (_a = authStore.state.user) == null ? void 0 : _a.address;
        if (!currentUser2) return [];
        return dashboardProposals.value.filter((p2) => {
          var _a2;
          const hasNoTeamAction = !((_a2 = p2.team_actions) == null ? void 0 : _a2.some((action) => action.wallet_address === currentUser2));
          const isAssignedToMe = p2.assigned_to === currentUser2;
          const needsEvaluation = isAssignedToMe && !p2.suggested_vote;
          const inActionableStatus = ["Considering", "Ready for approval", "Waiting for agreement"].includes(p2.internal_status);
          return hasNoTeamAction && inActionableStatus || needsEvaluation;
        });
      });
      const myEvaluations2 = computed(() => {
        var _a;
        const currentUser2 = (_a = authStore.state.user) == null ? void 0 : _a.address;
        if (!currentUser2) return [];
        return dashboardProposals.value.filter((p2) => p2.assigned_to === currentUser2 && p2.suggested_vote);
      });
      const totalTeamActions = computed(() => {
        const user = currentUser.value;
        let count = 0;
        dashboardProposals.value.forEach((p2) => {
          var _a;
          if ((_a = p2.team_actions) == null ? void 0 : _a.some((action) => action.wallet_address === user)) {
            count++;
          }
        });
        return count;
      });
      const completedAssignments = computed(
        () => myAssignments2.value.filter(
          (p2) => ["Ready to vote", "Voted 👍 Aye 👍", "Voted 👎 Nay 👎", "Voted ✌️ Abstain ✌️"].includes(p2.internal_status)
        ).length
      );
      const activityCount = computed(() => recentActivity.value.length);
      const loadData = async () => {
        var _a;
        loading.value = true;
        try {
          if (!authStore.state.isAuthenticated || !((_a = authStore.state.user) == null ? void 0 : _a.address)) {
            return;
          }
          const apiService = ApiService.getInstance();
          try {
            const assignments = await apiService.getMyAssignments();
            const needingAttention = await apiService.getProposalsNeedingAttention();
            const allProposals = [...assignments, ...needingAttention];
            const uniqueProposals = allProposals.filter(
              (proposal, index, self2) => index === self2.findIndex((p2) => p2.post_id === proposal.post_id && p2.chain === proposal.chain)
            );
            dashboardProposals.value = uniqueProposals;
          } catch (apiError) {
            console.warn("Specific API endpoints failed, falling back to general proposal list:", apiError);
            try {
              console.warn("No fallback endpoint available, using empty proposals");
              const relevantProposals = [];
              dashboardProposals.value = relevantProposals;
            } catch (fallbackError) {
              console.error("All API calls failed:", fallbackError);
              dashboardProposals.value = [];
            }
          }
          const recentProposals = [...dashboardProposals.value].sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()).slice(0, 10);
          recentActivity.value = recentProposals.map((p2) => ({
            id: `${p2.chain}-${p2.post_id}`,
            type: p2.suggested_vote ? "evaluation" : "assignment",
            description: `${p2.suggested_vote ? "Evaluated" : "Assigned to"} proposal #${p2.post_id}: ${p2.title}`,
            timestamp: p2.updated_at || p2.created_at
          }));
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
          proposalStore.setProposals([]);
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
        } catch (error) {
          console.error("Failed to open proposal:", error);
        }
      };
      const getRequiredAction = (proposal) => {
        var _a;
        const user = currentUser.value;
        const hasTeamAction = (_a = proposal.team_actions) == null ? void 0 : _a.some((action) => action.wallet_address === user);
        const isAssignedToMe = proposal.assigned_to === user;
        if (isAssignedToMe && !proposal.suggested_vote) {
          return "Needs Evaluation";
        }
        if (!hasTeamAction) {
          return "Team Action Required";
        }
        return "Review Needed";
      };
      const getAgreementStatus = (proposal) => {
        const agreements = proposal.agreement_count || 0;
        const required = proposal.required_agreements || 4;
        return `${agreements}/${required} agreements`;
      };
      const getActivityIcon = (type) => {
        switch (type) {
          case "evaluation":
            return "";
          case "team-action":
            return "";
          case "assignment":
            return "";
          case "vote":
            return "";
          default:
            return "";
        }
      };
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          emit2("close");
        }
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
        document.addEventListener("keydown", handleEscKey);
      });
      onUnmounted(() => {
        document.removeEventListener("keydown", handleEscKey);
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "dashboard-modal",
            onClick: _cache[6] || (_cache[6] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$b, [
              _cache[8] || (_cache[8] = createBaseVNode("h2", null, "My Dashboard", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$b, [
              !unref(authStore).state.isAuthenticated ? (openBlock(), createElementBlock("div", _hoisted_3$b, [
                _cache[9] || (_cache[9] = createBaseVNode("div", { class: "auth-icon" }, "🔐", -1)),
                _cache[10] || (_cache[10] = createBaseVNode("h3", null, "Authentication Required", -1)),
                _cache[11] || (_cache[11] = createBaseVNode("p", null, "Please connect your wallet to view your dashboard", -1)),
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close")),
                  class: "connect-btn"
                }, "Connect Wallet")
              ])) : (openBlock(), createElementBlock("div", _hoisted_4$8, [
                createBaseVNode("div", _hoisted_5$8, [
                  createBaseVNode("div", _hoisted_6$7, [
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "assignments" }]),
                      onClick: _cache[2] || (_cache[2] = ($event) => activeTab.value = "assignments")
                    }, [
                      createBaseVNode("div", _hoisted_7$6, toDisplayString(myAssignments2.value.length), 1),
                      _cache[12] || (_cache[12] = createBaseVNode("div", { class: "stat-label" }, "My Assignments", -1))
                    ], 2),
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "actions" }]),
                      onClick: _cache[3] || (_cache[3] = ($event) => activeTab.value = "actions")
                    }, [
                      createBaseVNode("div", _hoisted_8$6, toDisplayString(actionsNeeded2.value.length), 1),
                      _cache[13] || (_cache[13] = createBaseVNode("div", { class: "stat-label" }, "Actions Needed", -1))
                    ], 2),
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "evaluations" }]),
                      onClick: _cache[4] || (_cache[4] = ($event) => activeTab.value = "evaluations")
                    }, [
                      createBaseVNode("div", _hoisted_9$6, toDisplayString(myEvaluations2.value.length), 1),
                      _cache[14] || (_cache[14] = createBaseVNode("div", { class: "stat-label" }, "My Evaluations", -1))
                    ], 2),
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "activity" }]),
                      onClick: _cache[5] || (_cache[5] = ($event) => activeTab.value = "activity")
                    }, [
                      createBaseVNode("div", _hoisted_10$6, toDisplayString(activityCount.value), 1),
                      _cache[15] || (_cache[15] = createBaseVNode("div", { class: "stat-label" }, "My Activity", -1))
                    ], 2)
                  ])
                ]),
                createBaseVNode("div", _hoisted_11$5, [
                  activeTab.value === "assignments" ? (openBlock(), createElementBlock("div", _hoisted_12$4, [
                    myAssignments2.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_13$3, [..._cache[16] || (_cache[16] = [
                      createBaseVNode("div", { class: "empty-icon" }, "📭", -1),
                      createBaseVNode("h3", null, "No assignments", -1),
                      createBaseVNode("p", null, "You don't have any proposals assigned to you", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_14$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(myAssignments2.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_16$3, [
                            createBaseVNode("span", _hoisted_17$3, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_18$3, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_19$3, [
                            createBaseVNode("div", _hoisted_20$3, [
                              _cache[17] || (_cache[17] = createBaseVNode("strong", null, "Timeline:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.referendum_timeline || "Unknown"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_21$3, [
                              _cache[18] || (_cache[18] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ])
                          ])
                        ], 8, _hoisted_15$3);
                      }), 128))
                    ]))
                  ])) : createCommentVNode("", true),
                  activeTab.value === "actions" ? (openBlock(), createElementBlock("div", _hoisted_22$3, [
                    actionsNeeded2.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_23$3, [..._cache[19] || (_cache[19] = [
                      createBaseVNode("div", { class: "empty-icon" }, "✅", -1),
                      createBaseVNode("h3", null, "All caught up!", -1),
                      createBaseVNode("p", null, "You don't have any pending actions", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_24$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(actionsNeeded2.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item urgent",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_26$3, [
                            createBaseVNode("span", _hoisted_27$3, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_28$3, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_29$3, [
                            createBaseVNode("span", _hoisted_30$3, toDisplayString(getRequiredAction(proposal)), 1)
                          ]),
                          createBaseVNode("div", _hoisted_31$3, [
                            createBaseVNode("div", _hoisted_32$3, [
                              _cache[20] || (_cache[20] = createBaseVNode("strong", null, "Assigned:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.assigned_to === currentUser.value ? "You" : proposal.assigned_to || "Unassigned"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_33$3, [
                              _cache[21] || (_cache[21] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ])
                          ])
                        ], 8, _hoisted_25$3);
                      }), 128))
                    ]))
                  ])) : createCommentVNode("", true),
                  activeTab.value === "evaluations" ? (openBlock(), createElementBlock("div", _hoisted_34$3, [
                    myEvaluations2.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_35$3, [..._cache[22] || (_cache[22] = [
                      createBaseVNode("div", { class: "empty-icon" }, "🎯", -1),
                      createBaseVNode("h3", null, "No evaluations", -1),
                      createBaseVNode("p", null, "You're not evaluating any proposals", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_36$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(myEvaluations2.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_38$3, [
                            createBaseVNode("span", _hoisted_39$3, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_40$3, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_41$3, [
                            proposal.suggested_vote ? (openBlock(), createElementBlock("div", _hoisted_42$3, [
                              _cache[23] || (_cache[23] = createBaseVNode("strong", null, "Suggested Vote:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.suggested_vote), 1)
                            ])) : createCommentVNode("", true),
                            proposal.reason_for_vote ? (openBlock(), createElementBlock("div", _hoisted_43$3, [
                              _cache[24] || (_cache[24] = createBaseVNode("strong", null, "Reason:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.reason_for_vote), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_44$3, [
                            createBaseVNode("div", _hoisted_45$3, [
                              _cache[25] || (_cache[25] = createBaseVNode("strong", null, "Agreement:", -1)),
                              createTextVNode(" " + toDisplayString(getAgreementStatus(proposal)), 1)
                            ]),
                            createBaseVNode("div", _hoisted_46$3, [
                              _cache[26] || (_cache[26] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ])
                          ])
                        ], 8, _hoisted_37$3);
                      }), 128))
                    ]))
                  ])) : createCommentVNode("", true),
                  activeTab.value === "activity" ? (openBlock(), createElementBlock("div", _hoisted_47$3, [
                    createBaseVNode("div", _hoisted_48$3, [
                      _cache[30] || (_cache[30] = createBaseVNode("h3", null, "Recent Activity Summary", -1)),
                      createBaseVNode("div", _hoisted_49$3, [
                        createBaseVNode("div", _hoisted_50$3, [
                          _cache[27] || (_cache[27] = createBaseVNode("span", { class: "stat-label" }, "Proposals Evaluated:", -1)),
                          createBaseVNode("span", _hoisted_51$2, toDisplayString(myEvaluations2.value.length), 1)
                        ]),
                        createBaseVNode("div", _hoisted_52$2, [
                          _cache[28] || (_cache[28] = createBaseVNode("span", { class: "stat-label" }, "Team Actions Taken:", -1)),
                          createBaseVNode("span", _hoisted_53$2, toDisplayString(totalTeamActions.value), 1)
                        ]),
                        createBaseVNode("div", _hoisted_54$2, [
                          _cache[29] || (_cache[29] = createBaseVNode("span", { class: "stat-label" }, "Assignments Completed:", -1)),
                          createBaseVNode("span", _hoisted_55$2, toDisplayString(completedAssignments.value), 1)
                        ])
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_56$2, [
                      _cache[32] || (_cache[32] = createBaseVNode("h4", null, "Recent Actions", -1)),
                      recentActivity.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_57$2, [..._cache[31] || (_cache[31] = [
                        createBaseVNode("p", null, "No recent activity", -1)
                      ])])) : (openBlock(), createElementBlock("div", _hoisted_58$2, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(recentActivity.value, (activity) => {
                          return openBlock(), createElementBlock("div", {
                            key: activity.id,
                            class: "activity-item"
                          }, [
                            createBaseVNode("div", _hoisted_59$2, toDisplayString(getActivityIcon(activity.type)), 1),
                            createBaseVNode("div", _hoisted_60$1, [
                              createBaseVNode("div", _hoisted_61$1, toDisplayString(activity.description), 1),
                              createBaseVNode("div", _hoisted_62$1, toDisplayString(unref(formatDate)(activity.timestamp)), 1)
                            ])
                          ]);
                        }), 128))
                      ]))
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ]))
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const MyDashboard = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-4961dea0"]]);
  const _hoisted_1$a = { class: "modal-header" };
  const _hoisted_2$a = { class: "modal-body" };
  const _hoisted_3$a = { class: "modal-actions" };
  const _sfc_main$a = /* @__PURE__ */ defineComponent({
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
            createBaseVNode("div", _hoisted_1$a, [
              createBaseVNode("div", {
                class: normalizeClass(["icon", iconClass.value])
              }, toDisplayString(icon.value), 3),
              createBaseVNode("h3", null, toDisplayString(_ctx.title), 1)
            ]),
            createBaseVNode("div", _hoisted_2$a, [
              createBaseVNode("p", null, toDisplayString(_ctx.message), 1)
            ]),
            createBaseVNode("div", _hoisted_3$a, [
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
  const AlertModal = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-cafa1a99"]]);
  const _hoisted_1$9 = { class: "modal-header" };
  const _hoisted_2$9 = { class: "workflow-content" };
  const _hoisted_3$9 = {
    key: 0,
    class: "loading-state"
  };
  const _hoisted_4$7 = {
    key: 1,
    class: "error-state"
  };
  const _hoisted_5$7 = { class: "stats-section" };
  const _hoisted_6$6 = { class: "stats-section-container" };
  const _hoisted_7$5 = { class: "stat-number" };
  const _hoisted_8$5 = { class: "stat-number" };
  const _hoisted_9$5 = { class: "stat-number" };
  const _hoisted_10$5 = { class: "stat-number" };
  const _hoisted_11$4 = { class: "content-section" };
  const _hoisted_12$3 = {
    key: 0,
    class: "content-area"
  };
  const _hoisted_13$2 = { class: "panel-header" };
  const _hoisted_14$2 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_15$2 = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_16$2 = ["onClick"];
  const _hoisted_17$2 = { class: "proposal-header" };
  const _hoisted_18$2 = { class: "proposal-id" };
  const _hoisted_19$2 = { class: "proposal-title" };
  const _hoisted_20$2 = { class: "agreement-progress" };
  const _hoisted_21$2 = { class: "progress-header" };
  const _hoisted_22$2 = { class: "progress-count" };
  const _hoisted_23$2 = { class: "progress-bar" };
  const _hoisted_24$2 = { class: "team-status" };
  const _hoisted_25$2 = { class: "status-section" };
  const _hoisted_26$2 = { class: "member-list" };
  const _hoisted_27$2 = {
    key: 0,
    class: "no-members"
  };
  const _hoisted_28$2 = { class: "proposal-meta" };
  const _hoisted_29$2 = { class: "meta-item" };
  const _hoisted_30$2 = { class: "meta-item" };
  const _hoisted_31$2 = { class: "meta-item" };
  const _hoisted_32$2 = {
    key: 1,
    class: "content-area"
  };
  const _hoisted_33$2 = { class: "panel-header" };
  const _hoisted_34$2 = ["disabled"];
  const _hoisted_35$2 = {
    key: 0,
    class: "loading-spinner"
  };
  const _hoisted_36$2 = { key: 1 };
  const _hoisted_37$2 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_38$2 = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_39$2 = ["onClick"];
  const _hoisted_40$2 = { class: "proposal-header" };
  const _hoisted_41$2 = { class: "proposal-id" };
  const _hoisted_42$2 = { class: "proposal-title" };
  const _hoisted_43$2 = { class: "voting-info" };
  const _hoisted_44$2 = { class: "vote-recommendation" };
  const _hoisted_45$2 = { class: "vote-badge" };
  const _hoisted_46$2 = {
    key: 0,
    class: "vote-reason"
  };
  const _hoisted_47$2 = { class: "proposal-meta" };
  const _hoisted_48$2 = { class: "meta-item" };
  const _hoisted_49$2 = { class: "meta-item" };
  const _hoisted_50$2 = { class: "meta-item" };
  const _hoisted_51$1 = {
    key: 2,
    class: "content-area"
  };
  const _hoisted_52$1 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_53$1 = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_54$1 = ["onClick"];
  const _hoisted_55$1 = { class: "proposal-header" };
  const _hoisted_56$1 = { class: "proposal-id" };
  const _hoisted_57$1 = { class: "proposal-title" };
  const _hoisted_58$1 = { class: "discussion-info" };
  const _hoisted_59$1 = { class: "discussion-members" };
  const _hoisted_60 = { class: "member-list" };
  const _hoisted_61 = { class: "proposal-meta" };
  const _hoisted_62 = { class: "meta-item" };
  const _hoisted_63 = { class: "meta-item" };
  const _hoisted_64 = { class: "meta-item" };
  const _hoisted_65 = {
    key: 3,
    class: "content-area"
  };
  const _hoisted_66 = {
    key: 0,
    class: "empty-state"
  };
  const _hoisted_67 = {
    key: 1,
    class: "proposals-list"
  };
  const _hoisted_68 = ["onClick"];
  const _hoisted_69 = { class: "proposal-header" };
  const _hoisted_70 = { class: "proposal-id" };
  const _hoisted_71 = { class: "proposal-title" };
  const _hoisted_72 = { class: "veto-info" };
  const _hoisted_73 = { class: "veto-alert" };
  const _hoisted_74 = {
    key: 0,
    class: "veto-reason"
  };
  const _hoisted_75 = {
    key: 1,
    class: "veto-date"
  };
  const _hoisted_76 = { class: "proposal-meta" };
  const _hoisted_77 = { class: "meta-item" };
  const _hoisted_78 = { class: "meta-item" };
  const _sfc_main$9 = /* @__PURE__ */ defineComponent({
    __name: "TeamWorkflow",
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
      const normalizeAddress = (address) => {
        try {
          const publicKey = decodeAddress(address);
          return encodeAddress(publicKey, 42);
        } catch (error2) {
          console.warn("Failed to normalize address:", address, error2);
          return address;
        }
      };
      const findTeamMemberByAddress = (address) => {
        const normalizedSearchAddress = normalizeAddress(address);
        const member = teamStore.teamMembers.find((tm) => {
          const normalizedMemberAddress = normalizeAddress(tm.address);
          return normalizedMemberAddress === normalizedSearchAddress;
        });
        return member || null;
      };
      const getLocalTeamMemberName = (address) => {
        if (!address) return "Unknown";
        const member = findTeamMemberByAddress(address);
        return (member == null ? void 0 : member.name) || `${address.slice(0, 6)}...${address.slice(-6)}`;
      };
      const workflowData = ref({
        needsAgreement: [],
        readyToVote: [],
        forDiscussion: [],
        vetoed: []
      });
      const activeTab = ref("agreement");
      const loading = ref(false);
      const error = ref(null);
      computed(() => teamStore.teamMembers);
      const requiredAgreements = computed(() => {
        var _a;
        return ((_a = teamStore.daoConfig) == null ? void 0 : _a.required_agreements) || 4;
      });
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
      const filteredNeedsAgreement = computed(() => workflowData.value.needsAgreement);
      const filteredReadyToVote = computed(() => workflowData.value.readyToVote);
      const filteredForDiscussion = computed(() => workflowData.value.forDiscussion);
      const filteredVetoedProposals = computed(() => workflowData.value.vetoed);
      const loadData = async () => {
        if (!props.show) return;
        loading.value = true;
        error.value = null;
        try {
          const apiService = ApiService.getInstance();
          const [data, daoConfig] = await Promise.all([
            apiService.getTeamWorkflowData(),
            apiService.getDAOConfig()
          ]);
          workflowData.value = {
            needsAgreement: data.needsAgreement,
            readyToVote: data.readyToVote,
            forDiscussion: data.forDiscussion,
            vetoed: data.vetoedProposals
          };
          console.log("🚫 Vetoed proposals data:", data.vetoedProposals);
          if (daoConfig) {
            teamStore.setTeamMembers(daoConfig.team_members);
            console.log("👥 Team members loaded:", daoConfig.team_members);
          }
        } catch (err) {
          console.error("Error loading team workflow data:", err);
          error.value = "Failed to load data. Please try again.";
        } finally {
          loading.value = false;
        }
      };
      watch(() => props.show, (newValue) => {
        if (newValue) {
          console.log("🔄 TeamWorkflow modal shown, loading data...");
          loadData();
        }
      });
      watch(
        [filteredNeedsAgreement, filteredReadyToVote, filteredForDiscussion, filteredVetoedProposals],
        ([needs, ready, discuss, vetoed]) => {
          console.log("📊 Filtered lists updated:", {
            needsAgreement: needs.length,
            readyToVote: ready.length,
            forDiscussion: discuss.length,
            vetoedProposals: vetoed.length
          });
        }
      );
      const openProposal = (proposal) => {
        const url = `https://${proposal.chain}.polkassembly.io/referenda/${proposal.post_id}`;
        window.open(url, "_blank");
      };
      const getAgreementCount = (proposal) => {
        var _a, _b;
        const count = ((_b = (_a = proposal.team_actions) == null ? void 0 : _a.filter((action) => {
          var _a2;
          const actionType = (_a2 = action.role_type) == null ? void 0 : _a2.toLowerCase();
          return actionType === "agree";
        })) == null ? void 0 : _b.length) || 0;
        return count;
      };
      const getAgreedMembers = (proposal) => {
        var _a;
        const agreeActions = ((_a = proposal.team_actions) == null ? void 0 : _a.filter((action) => {
          var _a2;
          const actionType = (_a2 = action.role_type) == null ? void 0 : _a2.toLowerCase();
          return actionType === "agree";
        })) || [];
        return agreeActions.map((action) => ({
          name: action.team_member_name || getLocalTeamMemberName(action.wallet_address),
          address: action.wallet_address
        }));
      };
      const getDiscussionMembers = (proposal) => {
        var _a;
        const discussionActions = ((_a = proposal.team_actions) == null ? void 0 : _a.filter((action) => action.role_type === "To be discussed")) || [];
        return discussionActions.map((action) => ({
          name: action.team_member_name || getLocalTeamMemberName(action.wallet_address),
          address: action.wallet_address
        }));
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
      onMounted(() => {
        loadData();
      });
      return (_ctx, _cache) => {
        return _ctx.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal-overlay",
          onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("close"))
        }, [
          createBaseVNode("div", {
            class: "team-workflow-modal",
            onClick: _cache[5] || (_cache[5] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$9, [
              _cache[8] || (_cache[8] = createBaseVNode("h2", null, "Team Workflow", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$9, [
              loading.value ? (openBlock(), createElementBlock("div", _hoisted_3$9, [..._cache[9] || (_cache[9] = [
                createBaseVNode("div", { class: "loading-spinner" }, null, -1),
                createBaseVNode("p", null, "Loading team workflow data...", -1)
              ])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_4$7, [
                _cache[10] || (_cache[10] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)),
                _cache[11] || (_cache[11] = createBaseVNode("h3", null, "Error Loading Data", -1)),
                createBaseVNode("p", null, toDisplayString(error.value), 1),
                createBaseVNode("button", {
                  onClick: loadData,
                  class: "retry-btn"
                }, "Try Again")
              ])) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                createBaseVNode("div", _hoisted_5$7, [
                  createBaseVNode("div", _hoisted_6$6, [
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "agreement" }]),
                      onClick: _cache[1] || (_cache[1] = ($event) => activeTab.value = "agreement")
                    }, [
                      createBaseVNode("div", _hoisted_7$5, toDisplayString(filteredNeedsAgreement.value.length), 1),
                      _cache[12] || (_cache[12] = createBaseVNode("div", { class: "stat-label" }, "Needs Agreement", -1))
                    ], 2),
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "ready" }]),
                      onClick: _cache[2] || (_cache[2] = ($event) => activeTab.value = "ready")
                    }, [
                      createBaseVNode("div", _hoisted_8$5, toDisplayString(filteredReadyToVote.value.length), 1),
                      _cache[13] || (_cache[13] = createBaseVNode("div", { class: "stat-label" }, "Ready to Vote", -1))
                    ], 2),
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "discussion" }]),
                      onClick: _cache[3] || (_cache[3] = ($event) => activeTab.value = "discussion")
                    }, [
                      createBaseVNode("div", _hoisted_9$5, toDisplayString(filteredForDiscussion.value.length), 1),
                      _cache[14] || (_cache[14] = createBaseVNode("div", { class: "stat-label" }, "For Discussion", -1))
                    ], 2),
                    createBaseVNode("div", {
                      class: normalizeClass(["stat-card", { active: activeTab.value === "vetoed" }]),
                      onClick: _cache[4] || (_cache[4] = ($event) => activeTab.value = "vetoed")
                    }, [
                      createBaseVNode("div", _hoisted_10$5, toDisplayString(filteredVetoedProposals.value.length), 1),
                      _cache[15] || (_cache[15] = createBaseVNode("div", { class: "stat-label" }, "NO WAYED", -1))
                    ], 2)
                  ])
                ]),
                createBaseVNode("div", _hoisted_11$4, [
                  activeTab.value === "agreement" ? (openBlock(), createElementBlock("div", _hoisted_12$3, [
                    createBaseVNode("div", _hoisted_13$2, [
                      _cache[16] || (_cache[16] = createBaseVNode("h3", null, "Proposals Waiting for Team Agreement", -1)),
                      createBaseVNode("p", null, "These proposals need " + toDisplayString(requiredAgreements.value) + " team member agreements to proceed to voting.", 1)
                    ]),
                    filteredNeedsAgreement.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_14$2, [..._cache[17] || (_cache[17] = [
                      createBaseVNode("div", { class: "empty-icon" }, "✅", -1),
                      createBaseVNode("h3", null, "All caught up!", -1),
                      createBaseVNode("p", null, "No proposals are waiting for agreement", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_15$2, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(filteredNeedsAgreement.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item agreement-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_17$2, [
                            createBaseVNode("span", _hoisted_18$2, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_19$2, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_20$2, [
                            createBaseVNode("div", _hoisted_21$2, [
                              _cache[18] || (_cache[18] = createBaseVNode("span", null, "Agreement Progress", -1)),
                              createBaseVNode("span", _hoisted_22$2, toDisplayString(getAgreementCount(proposal)) + "/" + toDisplayString(requiredAgreements.value), 1)
                            ]),
                            createBaseVNode("div", _hoisted_23$2, [
                              createBaseVNode("div", {
                                class: "progress-fill",
                                style: normalizeStyle({
                                  width: `${Math.min(getAgreementCount(proposal) / requiredAgreements.value * 100, 100)}%`,
                                  backgroundColor: getAgreementCount(proposal) >= requiredAgreements.value ? "#28a745" : "#ffc107"
                                })
                              }, null, 4)
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_24$2, [
                            createBaseVNode("div", _hoisted_25$2, [
                              _cache[19] || (_cache[19] = createBaseVNode("h5", null, "Agreed Members", -1)),
                              createBaseVNode("div", _hoisted_26$2, [
                                (openBlock(true), createElementBlock(Fragment, null, renderList(getAgreedMembers(proposal), (member) => {
                                  return openBlock(), createElementBlock("span", {
                                    key: member.address,
                                    class: "member-badge agreed"
                                  }, toDisplayString(member.name), 1);
                                }), 128)),
                                getAgreedMembers(proposal).length === 0 ? (openBlock(), createElementBlock("span", _hoisted_27$2, "None yet")) : createCommentVNode("", true)
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_28$2, [
                            createBaseVNode("div", _hoisted_29$2, [
                              _cache[20] || (_cache[20] = createBaseVNode("strong", null, "Evaluator:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.assigned_to || "Unassigned"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_30$2, [
                              _cache[21] || (_cache[21] = createBaseVNode("strong", null, "Suggested Vote:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.suggested_vote || "Not set"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_31$2, [
                              _cache[22] || (_cache[22] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ])
                          ])
                        ], 8, _hoisted_16$2);
                      }), 128))
                    ]))
                  ])) : createCommentVNode("", true),
                  activeTab.value === "ready" ? (openBlock(), createElementBlock("div", _hoisted_32$2, [
                    createBaseVNode("div", _hoisted_33$2, [
                      _cache[23] || (_cache[23] = createBaseVNode("h3", null, "Proposals Ready for Voting", -1)),
                      _cache[24] || (_cache[24] = createBaseVNode("p", null, "These proposals have received sufficient team agreement and are ready for on-chain voting.", -1)),
                      createBaseVNode("button", {
                        onClick: sendToMimir,
                        disabled: sendingToMimir.value || filteredReadyToVote.value.length === 0,
                        class: "send-to-mimir-btn"
                      }, [
                        sendingToMimir.value ? (openBlock(), createElementBlock("span", _hoisted_35$2)) : (openBlock(), createElementBlock("span", _hoisted_36$2, "Send to Mimir"))
                      ], 8, _hoisted_34$2)
                    ]),
                    filteredReadyToVote.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_37$2, [..._cache[25] || (_cache[25] = [
                      createBaseVNode("div", { class: "empty-icon" }, "🗳️", -1),
                      createBaseVNode("h3", null, "No proposals ready", -1),
                      createBaseVNode("p", null, "No proposals are currently ready for voting", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_38$2, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(filteredReadyToVote.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item ready-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_40$2, [
                            createBaseVNode("span", _hoisted_41$2, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_42$2, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_43$2, [
                            createBaseVNode("div", _hoisted_44$2, [
                              _cache[26] || (_cache[26] = createBaseVNode("strong", null, "Team Recommendation:", -1)),
                              createBaseVNode("span", _hoisted_45$2, toDisplayString(proposal.suggested_vote || "Not set"), 1)
                            ]),
                            proposal.reason_for_vote ? (openBlock(), createElementBlock("div", _hoisted_46$2, [
                              _cache[27] || (_cache[27] = createBaseVNode("strong", null, "Reason:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.reason_for_vote), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_47$2, [
                            createBaseVNode("div", _hoisted_48$2, [
                              _cache[28] || (_cache[28] = createBaseVNode("strong", null, "Evaluator:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.assigned_to || "Unassigned"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_49$2, [
                              _cache[29] || (_cache[29] = createBaseVNode("strong", null, "Timeline:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.referendum_timeline || "Unknown"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_50$2, [
                              _cache[30] || (_cache[30] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ])
                          ])
                        ], 8, _hoisted_39$2);
                      }), 128))
                    ]))
                  ])) : createCommentVNode("", true),
                  activeTab.value === "discussion" ? (openBlock(), createElementBlock("div", _hoisted_51$1, [
                    _cache[36] || (_cache[36] = createBaseVNode("div", { class: "panel-header" }, [
                      createBaseVNode("h3", null, "Proposals for Team Discussion"),
                      createBaseVNode("p", null, "These proposals have been marked for team discussion before proceeding.")
                    ], -1)),
                    filteredForDiscussion.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_52$1, [..._cache[31] || (_cache[31] = [
                      createBaseVNode("div", { class: "empty-icon" }, "💬", -1),
                      createBaseVNode("h3", null, "No discussions needed", -1),
                      createBaseVNode("p", null, "No proposals are marked for discussion", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_53$1, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(filteredForDiscussion.value, (proposal) => {
                        var _a;
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item discussion-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_55$1, [
                            createBaseVNode("span", _hoisted_56$1, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_57$1, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_58$1, [
                            createBaseVNode("div", _hoisted_59$1, [
                              _cache[32] || (_cache[32] = createBaseVNode("strong", null, "Marked for discussion by:", -1)),
                              createBaseVNode("div", _hoisted_60, [
                                (openBlock(true), createElementBlock(Fragment, null, renderList(getDiscussionMembers(proposal), (member) => {
                                  return openBlock(), createElementBlock("span", {
                                    key: member.address,
                                    class: "member-badge discussion"
                                  }, toDisplayString(member.name), 1);
                                }), 128))
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_61, [
                            createBaseVNode("div", _hoisted_62, [
                              _cache[33] || (_cache[33] = createBaseVNode("strong", null, "Assigned:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.assigned_to || "Unassigned"), 1)
                            ]),
                            createBaseVNode("div", _hoisted_63, [
                              _cache[34] || (_cache[34] = createBaseVNode("strong", null, "Comments:", -1)),
                              createTextVNode(" " + toDisplayString(((_a = proposal.comments) == null ? void 0 : _a.length) || 0), 1)
                            ]),
                            createBaseVNode("div", _hoisted_64, [
                              _cache[35] || (_cache[35] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ])
                          ])
                        ], 8, _hoisted_54$1);
                      }), 128))
                    ]))
                  ])) : createCommentVNode("", true),
                  activeTab.value === "vetoed" ? (openBlock(), createElementBlock("div", _hoisted_65, [
                    _cache[44] || (_cache[44] = createBaseVNode("div", { class: "panel-header" }, [
                      createBaseVNode("h3", null, "NO WAYed Proposals"),
                      createBaseVNode("p", null, "These proposals have been vetoed by team members.")
                    ], -1)),
                    filteredVetoedProposals.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_66, [..._cache[37] || (_cache[37] = [
                      createBaseVNode("div", { class: "empty-icon" }, "🚫", -1),
                      createBaseVNode("h3", null, "No vetoed proposals", -1),
                      createBaseVNode("p", null, "No proposals have been NO WAYed", -1)
                    ])])) : (openBlock(), createElementBlock("div", _hoisted_67, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(filteredVetoedProposals.value, (proposal) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${proposal.chain}-${proposal.post_id}`,
                          class: "proposal-item vetoed-item",
                          onClick: ($event) => openProposal(proposal)
                        }, [
                          createBaseVNode("div", _hoisted_69, [
                            createBaseVNode("span", _hoisted_70, "#" + toDisplayString(proposal.post_id), 1),
                            createVNode(StatusBadge, {
                              status: proposal.internal_status,
                              "proposal-id": proposal.post_id,
                              editable: false
                            }, null, 8, ["status", "proposal-id"])
                          ]),
                          createBaseVNode("h4", _hoisted_71, toDisplayString(proposal.title), 1),
                          createBaseVNode("div", _hoisted_72, [
                            createBaseVNode("div", _hoisted_73, [
                              _cache[38] || (_cache[38] = createBaseVNode("span", { class: "alert-icon" }, "🚫", -1)),
                              _cache[39] || (_cache[39] = createBaseVNode("strong", null, "NO WAYed by:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.veto_by_name || getLocalTeamMemberName(proposal.veto_by)), 1)
                            ]),
                            proposal.veto_reason ? (openBlock(), createElementBlock("div", _hoisted_74, [
                              _cache[40] || (_cache[40] = createBaseVNode("strong", null, "Reason:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.veto_reason), 1)
                            ])) : createCommentVNode("", true),
                            proposal.veto_date ? (openBlock(), createElementBlock("div", _hoisted_75, [
                              _cache[41] || (_cache[41] = createBaseVNode("strong", null, "NO WAYed on:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.veto_date)), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_76, [
                            createBaseVNode("div", _hoisted_77, [
                              _cache[42] || (_cache[42] = createBaseVNode("strong", null, "Chain:", -1)),
                              createTextVNode(" " + toDisplayString(proposal.chain), 1)
                            ]),
                            createBaseVNode("div", _hoisted_78, [
                              _cache[43] || (_cache[43] = createBaseVNode("strong", null, "Updated:", -1)),
                              createTextVNode(" " + toDisplayString(unref(formatDate)(proposal.updated_at || proposal.created_at)), 1)
                            ])
                          ])
                        ], 8, _hoisted_68);
                      }), 128))
                    ]))
                  ])) : createCommentVNode("", true)
                ])
              ], 64))
            ])
          ]),
          createVNode(AlertModal, {
            show: showAlertModal.value,
            title: alertModalData.value.title,
            message: alertModalData.value.message,
            type: alertModalData.value.type,
            onOk: _cache[6] || (_cache[6] = ($event) => showAlertModal.value = false)
          }, null, 8, ["show", "title", "message", "type"])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const TeamWorkflow = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-303a7545"]]);
  const _hoisted_1$8 = { class: "modal-header" };
  const _hoisted_2$8 = { class: "settings-content" };
  const _hoisted_3$8 = { class: "settings-nav" };
  const _hoisted_4$6 = { class: "nav-section" };
  const _hoisted_5$6 = { class: "nav-section" };
  const _hoisted_6$5 = { class: "nav-section" };
  const _hoisted_7$4 = { class: "settings-main" };
  const _hoisted_8$4 = {
    key: 0,
    class: "section-content"
  };
  const _hoisted_9$4 = { class: "config-form" };
  const _hoisted_10$4 = { class: "form-group" };
  const _hoisted_11$3 = { class: "backend-config" };
  const _hoisted_12$2 = { class: "backend-actions" };
  const _hoisted_13$1 = ["disabled"];
  const _hoisted_14$1 = ["disabled"];
  const _hoisted_15$1 = { class: "form-group" };
  const _hoisted_16$1 = { class: "readonly-field" };
  const _hoisted_17$1 = { class: "form-group" };
  const _hoisted_18$1 = { class: "team-members-list" };
  const _hoisted_19$1 = { class: "member-display-name" };
  const _hoisted_20$1 = { class: "member-address" };
  const _hoisted_21$1 = {
    key: 0,
    class: "no-members"
  };
  const _hoisted_22$1 = {
    key: 1,
    class: "section-content"
  };
  const _hoisted_23$1 = {
    key: 2,
    class: "section-content"
  };
  const _hoisted_24$1 = { class: "voting-stats" };
  const _hoisted_25$1 = { class: "stat-card" };
  const _hoisted_26$1 = { class: "stat-number" };
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
  const _sfc_main$8 = /* @__PURE__ */ defineComponent({
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
      const extensionVersion = ref("1.0.0");
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
            createBaseVNode("div", _hoisted_1$8, [
              _cache[15] || (_cache[15] = createBaseVNode("h2", null, "Settings & More", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$8, [
              createBaseVNode("div", _hoisted_3$8, [
                createBaseVNode("div", _hoisted_4$6, [
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
                createBaseVNode("div", _hoisted_5$6, [
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
                createBaseVNode("div", _hoisted_6$5, [
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
              createBaseVNode("div", _hoisted_7$4, [
                activeSection.value === "dao-config" ? (openBlock(), createElementBlock("div", _hoisted_8$4, [
                  _cache[37] || (_cache[37] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "DAO Configuration"),
                    createBaseVNode("p", null, "Configure your DAO settings and team parameters")
                  ], -1)),
                  createBaseVNode("div", _hoisted_9$4, [
                    createBaseVNode("div", _hoisted_10$4, [
                      _cache[26] || (_cache[26] = createBaseVNode("label", null, "Backend API Endpoint", -1)),
                      createBaseVNode("div", _hoisted_11$3, [
                        withDirectives(createBaseVNode("input", {
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => backendUrl.value = $event),
                          type: "url",
                          class: "form-input",
                          placeholder: "https://api.yourdao.com",
                          onBlur: validateBackendUrl
                        }, null, 544), [
                          [vModelText, backendUrl.value]
                        ]),
                        createBaseVNode("div", _hoisted_12$2, [
                          createBaseVNode("button", {
                            onClick: testBackendConnection,
                            class: "test-btn",
                            disabled: testingConnection.value || !backendUrl.value
                          }, toDisplayString(testingConnection.value ? "Testing..." : "Test"), 9, _hoisted_13$1),
                          createBaseVNode("button", {
                            onClick: saveBackendUrl,
                            class: "save-backend-btn",
                            disabled: savingBackend.value || !backendUrl.value
                          }, toDisplayString(savingBackend.value ? "Saving..." : "Save"), 9, _hoisted_14$1)
                        ])
                      ]),
                      backendStatus.value.message ? (openBlock(), createElementBlock("div", {
                        key: 0,
                        class: normalizeClass(["backend-status", backendStatus.value.type])
                      }, toDisplayString(backendStatus.value.message), 3)) : createCommentVNode("", true),
                      _cache[27] || (_cache[27] = createBaseVNode("small", null, `Enter the URL of your DAO's VotingTool backend server. Click "Save" first to grant permissions, then "Test" to verify connection.`, -1))
                    ]),
                    createBaseVNode("div", _hoisted_15$1, [
                      _cache[29] || (_cache[29] = createBaseVNode("label", null, "Required Agreements", -1)),
                      createBaseVNode("div", _hoisted_16$1, [
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
                    createBaseVNode("div", _hoisted_17$1, [
                      _cache[33] || (_cache[33] = createBaseVNode("label", null, "Team Members", -1)),
                      _cache[34] || (_cache[34] = createBaseVNode("div", { class: "readonly-field-header" }, [
                        createBaseVNode("span", { class: "multisig-badge" }, "🔒 Controlled by Multisig")
                      ], -1)),
                      _cache[35] || (_cache[35] = createBaseVNode("p", { class: "form-note" }, "Team members are automatically synced from the multisig configuration.", -1)),
                      createBaseVNode("div", _hoisted_18$1, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(daoConfig.value.teamMembers, (member, index) => {
                          return openBlock(), createElementBlock("div", {
                            key: index,
                            class: "member-item readonly"
                          }, [
                            createBaseVNode("div", _hoisted_19$1, toDisplayString(member.name || "Team Member " + (index + 1)), 1),
                            createBaseVNode("div", _hoisted_20$1, toDisplayString(member.address), 1),
                            _cache[31] || (_cache[31] = createBaseVNode("span", { class: "member-info" }, "From multisig", -1))
                          ]);
                        }), 128)),
                        daoConfig.value.teamMembers.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_21$1, [..._cache[32] || (_cache[32] = [
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
                activeSection.value === "preferences" ? (openBlock(), createElementBlock("div", _hoisted_22$1, [..._cache[38] || (_cache[38] = [
                  createStaticVNode('<div class="section-header" data-v-f35ef754><h3 data-v-f35ef754>User Preferences</h3><p data-v-f35ef754>Customize your extension experience (coming soon)</p></div><div class="coming-soon" data-v-f35ef754><div class="coming-soon-icon" data-v-f35ef754>🚧</div><h4 data-v-f35ef754>Feature in Development</h4><p data-v-f35ef754>User preferences will be available in a future update. This will include:</p><ul data-v-f35ef754><li data-v-f35ef754>Notification settings</li><li data-v-f35ef754>Default view modes</li><li data-v-f35ef754>Theme customization</li><li data-v-f35ef754>Auto-sync preferences</li></ul></div>', 2)
                ])])) : createCommentVNode("", true),
                activeSection.value === "voting-history" ? (openBlock(), createElementBlock("div", _hoisted_23$1, [
                  _cache[44] || (_cache[44] = createBaseVNode("div", { class: "section-header" }, [
                    createBaseVNode("h3", null, "Voting History"),
                    createBaseVNode("p", null, "Your voting record and participation statistics")
                  ], -1)),
                  createBaseVNode("div", _hoisted_24$1, [
                    createBaseVNode("div", _hoisted_25$1, [
                      createBaseVNode("div", _hoisted_26$1, toDisplayString(votingStats.value.totalVotes), 1),
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
                    _cache[50] || (_cache[50] = createStaticVNode('<div class="help-section" data-v-f35ef754><h4 data-v-f35ef754>Getting Started</h4><ul data-v-f35ef754><li data-v-f35ef754>Connect your wallet to authenticate</li><li data-v-f35ef754>Browse and filter proposals</li><li data-v-f35ef754>Assign proposals to team members</li><li data-v-f35ef754>Participate in team discussions</li></ul></div><div class="help-section" data-v-f35ef754><h4 data-v-f35ef754>Team Workflow</h4><ul data-v-f35ef754><li data-v-f35ef754><strong data-v-f35ef754>Agree:</strong> Support the proposal evaluation</li><li data-v-f35ef754><strong data-v-f35ef754>To be discussed:</strong> Mark for team discussion</li><li data-v-f35ef754><strong data-v-f35ef754>NO WAY (Veto):</strong> Forces Nay (needs reasoning)</li><li data-v-f35ef754><strong data-v-f35ef754>Recuse:</strong> Abstain due to conflict of interest</li></ul></div><div class="help-section" data-v-f35ef754><h4 data-v-f35ef754>Status Flow</h4><ol data-v-f35ef754><li data-v-f35ef754>Not started → Considering</li><li data-v-f35ef754>Considering → Ready for approval</li><li data-v-f35ef754>Ready for approval → Waiting for agreement</li><li data-v-f35ef754>Waiting for agreement → Ready to vote</li><li data-v-f35ef754>Ready to vote → Voted</li></ol></div>', 3)),
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
  const SettingsMore = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-f35ef754"]]);
  const _hoisted_1$7 = { class: "menu-container" };
  const _hoisted_2$7 = { class: "user-status" };
  const _hoisted_3$7 = {
    key: 0,
    class: "user-info"
  };
  const _hoisted_4$5 = { class: "user-avatar" };
  const _hoisted_5$5 = { class: "user-details" };
  const _hoisted_6$4 = { class: "user-name" };
  const _hoisted_7$3 = { class: "user-address" };
  const _hoisted_8$3 = { class: "user-network" };
  const _hoisted_9$3 = ["disabled"];
  const _hoisted_10$3 = {
    key: 1,
    class: "login-prompt"
  };
  const _hoisted_11$2 = { class: "menu-items" };
  const _sfc_main$7 = /* @__PURE__ */ defineComponent({
    __name: "Menu",
    setup(__props) {
      const showWalletConnect = ref(false);
      const showDAOConfig = ref(false);
      const showProposalBrowser = ref(false);
      const showMyDashboard = ref(false);
      const showTeamWorkflow = ref(false);
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
          case "my-dashboard":
            showMyDashboard.value = true;
            break;
          case "team-workflow":
            showTeamWorkflow.value = true;
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
        return openBlock(), createElementBlock("div", _hoisted_1$7, [
          createBaseVNode("div", _hoisted_2$7, [
            unref(authStore).state.isAuthenticated ? (openBlock(), createElementBlock("div", _hoisted_3$7, [
              createBaseVNode("div", _hoisted_4$5, toDisplayString(getUserInitials()), 1),
              createBaseVNode("div", _hoisted_5$5, [
                createBaseVNode("div", _hoisted_6$4, toDisplayString(((_a = unref(authStore).state.user) == null ? void 0 : _a.name) || "Unknown User"), 1),
                createBaseVNode("div", _hoisted_7$3, toDisplayString(unref(formatAddress)((_b = unref(authStore).state.user) == null ? void 0 : _b.address)), 1),
                createBaseVNode("div", _hoisted_8$3, toDisplayString((_c = unref(authStore).state.user) == null ? void 0 : _c.network), 1)
              ]),
              createBaseVNode("button", {
                onClick: handleLogout,
                class: "logout-btn",
                disabled: unref(authStore).state.isLoading
              }, toDisplayString(unref(authStore).state.isLoading ? "..." : "Logout"), 9, _hoisted_9$3)
            ])) : (openBlock(), createElementBlock("div", _hoisted_10$3, [
              _cache[13] || (_cache[13] = createBaseVNode("div", { class: "login-icon" }, "🔐", -1)),
              _cache[14] || (_cache[14] = createBaseVNode("div", { class: "login-text" }, "Connect your wallet to continue", -1)),
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
            }, [..._cache[15] || (_cache[15] = [
              createBaseVNode("span", { class: "icon" }, "📋", -1),
              createBaseVNode("span", null, "Browse Proposals", -1)
            ])]),
            createBaseVNode("div", {
              class: "menu-item",
              onClick: _cache[2] || (_cache[2] = ($event) => handleAction("my-dashboard")),
              title: "My assignments & actions needed"
            }, [..._cache[16] || (_cache[16] = [
              createBaseVNode("span", { class: "icon" }, "👤", -1),
              createBaseVNode("span", null, "My Dashboard", -1)
            ])]),
            createBaseVNode("div", {
              class: "menu-item",
              onClick: _cache[3] || (_cache[3] = ($event) => handleAction("team-workflow")),
              title: "Team collaboration & approvals"
            }, [..._cache[17] || (_cache[17] = [
              createBaseVNode("span", { class: "icon" }, "👥", -1),
              createBaseVNode("span", null, "Team Workflow", -1)
            ])]),
            createBaseVNode("div", {
              class: "menu-item",
              onClick: _cache[4] || (_cache[4] = ($event) => handleAction("settings-more")),
              title: "Configuration, history & help"
            }, [..._cache[18] || (_cache[18] = [
              createBaseVNode("span", { class: "icon" }, "⚙️", -1),
              createBaseVNode("span", null, "Settings & More", -1)
            ])])
          ]),
          showWalletConnect.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "modal-overlay",
            onClick: _cache[7] || (_cache[7] = ($event) => showWalletConnect.value = false)
          }, [
            createBaseVNode("div", {
              class: "modal-content",
              onClick: _cache[6] || (_cache[6] = withModifiers(() => {
              }, ["stop"]))
            }, [
              createVNode(WalletConnect, {
                onClose: _cache[5] || (_cache[5] = ($event) => showWalletConnect.value = false)
              })
            ])
          ])) : createCommentVNode("", true),
          createVNode(ProposalBrowser, {
            show: showProposalBrowser.value,
            onClose: _cache[8] || (_cache[8] = ($event) => showProposalBrowser.value = false)
          }, null, 8, ["show"]),
          createVNode(MyDashboard, {
            show: showMyDashboard.value,
            onClose: _cache[9] || (_cache[9] = ($event) => showMyDashboard.value = false)
          }, null, 8, ["show"]),
          createVNode(TeamWorkflow, {
            show: showTeamWorkflow.value,
            onClose: _cache[10] || (_cache[10] = ($event) => showTeamWorkflow.value = false)
          }, null, 8, ["show"]),
          createVNode(SettingsMore, {
            show: showSettingsMore.value,
            onClose: _cache[11] || (_cache[11] = ($event) => showSettingsMore.value = false)
          }, null, 8, ["show"]),
          createVNode(DAOConfigModal, {
            show: showDAOConfig.value,
            onClose: _cache[12] || (_cache[12] = ($event) => showDAOConfig.value = false),
            onSaved: handleConfigSaved
          }, null, 8, ["show"])
        ]);
      };
    }
  });
  const Menu = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-0610845d"]]);
  const _hoisted_1$6 = {
    id: "voting-tool-app",
    class: "voting-tool-container"
  };
  const _hoisted_2$6 = { class: "button-icon" };
  const _hoisted_3$6 = {
    key: 0,
    class: "hamburger-icon"
  };
  const _hoisted_4$4 = { key: 1 };
  const _hoisted_5$4 = {
    key: 0,
    class: "dropdown-menu"
  };
  const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    __name: "App",
    setup(__props) {
      const isMenuOpen = ref(false);
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$6, [
          createBaseVNode("div", {
            class: normalizeClass(["floating-button", { "menu-open": isMenuOpen.value }]),
            onClick: toggleMenu
          }, [
            createBaseVNode("div", _hoisted_2$6, [
              !isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_3$6, [..._cache[0] || (_cache[0] = [
                createBaseVNode("span", null, null, -1),
                createBaseVNode("span", null, null, -1),
                createBaseVNode("span", null, null, -1)
              ])])) : (openBlock(), createElementBlock("span", _hoisted_4$4, "✕"))
            ])
          ], 2),
          isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_5$4, [
            createVNode(Menu)
          ])) : createCommentVNode("", true)
        ]);
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-c1fca634"]]);
  const _hoisted_1$5 = { class: "modal-header" };
  const _hoisted_2$5 = { class: "modal-content" };
  const _hoisted_3$5 = { class: "status-options" };
  const _hoisted_4$3 = { class: "status-list" };
  const _hoisted_5$3 = ["onClick"];
  const _hoisted_6$3 = { class: "option-text" };
  const _hoisted_7$2 = {
    key: 0,
    class: "selected-indicator"
  };
  const _hoisted_8$2 = { class: "reason-section" };
  const _hoisted_9$2 = { class: "modal-actions" };
  const _hoisted_10$2 = ["disabled"];
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
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
      const statusOptions = Object.keys(statusConfig).map((status) => ({
        value: status,
        icon: statusConfig[status].icon,
        color: statusConfig[status].color
      }));
      const handleSave = () => {
        if (!selectedStatus.value || selectedStatus.value === props.currentStatus) return;
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
            createBaseVNode("div", _hoisted_1$5, [
              _cache[5] || (_cache[5] = createBaseVNode("h3", null, "Change Status", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$5, [
              createBaseVNode("p", null, [
                _cache[6] || (_cache[6] = createBaseVNode("strong", null, "Proposal:", -1)),
                createTextVNode(" #" + toDisplayString(_ctx.proposalId), 1)
              ]),
              createBaseVNode("p", null, [
                _cache[7] || (_cache[7] = createBaseVNode("strong", null, "Current Status:", -1)),
                createTextVNode(" " + toDisplayString(_ctx.currentStatus), 1)
              ]),
              createBaseVNode("div", _hoisted_3$5, [
                _cache[8] || (_cache[8] = createBaseVNode("label", null, "New Status:", -1)),
                createBaseVNode("div", _hoisted_4$3, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(statusOptions), (statusOption) => {
                    return openBlock(), createElementBlock("button", {
                      key: statusOption.value,
                      class: normalizeClass(["status-option", { selected: selectedStatus.value === statusOption.value }]),
                      onClick: ($event) => selectedStatus.value = statusOption.value
                    }, [
                      createBaseVNode("span", _hoisted_6$3, toDisplayString(statusOption.value), 1),
                      selectedStatus.value === statusOption.value ? (openBlock(), createElementBlock("span", _hoisted_7$2, "✓")) : createCommentVNode("", true)
                    ], 10, _hoisted_5$3);
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
  const StatusChangeModal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-85aced2c"]]);
  const _hoisted_1$4 = { class: "modal-header" };
  const _hoisted_2$4 = { class: "modal-content" };
  const _hoisted_3$4 = { class: "modal-actions" };
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "AssignModal",
    props: {
      show: { type: Boolean },
      proposalId: {}
    },
    emits: ["close", "confirm"],
    setup(__props, { emit: __emit }) {
      const emit2 = __emit;
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
            class: "assign-modal",
            onClick: _cache[3] || (_cache[3] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_1$4, [
              _cache[5] || (_cache[5] = createBaseVNode("h3", null, "Assign Proposal", -1)),
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
              _cache[7] || (_cache[7] = createBaseVNode("p", null, "This will assign the proposal to you for review and voting.", -1)),
              createBaseVNode("div", _hoisted_3$4, [
                createBaseVNode("button", {
                  class: "btn btn-secondary",
                  onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
                }, "Cancel"),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("confirm"))
                }, " Assign to Me ")
              ])
            ])
          ])
        ])) : createCommentVNode("", true);
      };
    }
  });
  const AssignModal = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-539e24b0"]]);
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
        const summary = await apiService.getAgreementSummary(props.proposalId, props.chain);
        agreementSummary.value = summary;
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
  const TeamActionsPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-66a5c8c1"]]);
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
  const _hoisted_10 = ["title"];
  const _hoisted_11 = { class: "btn-text" };
  const _hoisted_12 = ["title"];
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
    setup(__props) {
      const props = __props;
      const showStatusModal = ref(false);
      const showAssignModal = ref(false);
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
      const canUnassign = computed(() => {
        var _a;
        return authStore.state.isAuthenticated && props.assignedTo && addressesMatch(props.assignedTo, (_a = authStore.state.user) == null ? void 0 : _a.address);
      });
      const voteButtonTooltip = computed(() => {
        if (!authStore.state.isAuthenticated) {
          return "Click to connect wallet and vote";
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
        return "Change suggested vote";
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
          "status-clickable": props.editable,
          [`status-${props.status.toLowerCase().replace(/[^a-z0-9]/g, "-")}`]: true
        };
      });
      const statusIcon = computed(() => {
        var _a;
        return ((_a = statusConfig[props.status]) == null ? void 0 : _a.icon) || "⚪";
      });
      const handleStatusClick = () => {
        if (props.editable) {
          showStatusModal.value = true;
        }
      };
      const closeStatusModal = () => {
        showStatusModal.value = false;
      };
      const saveStatusChange = async (data) => {
        try {
          const changeData = {
            proposalId: props.proposalId,
            oldStatus: props.status,
            newStatus: data.newStatus,
            reason: data.reason
          };
          console.log("Status change requested:", changeData);
          closeStatusModal();
          window.dispatchEvent(new CustomEvent("statusChanged", { detail: changeData }));
        } catch (error) {
          console.error("Failed to update status:", error);
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
      const handleUnassign = async () => {
        confirmModalData.value = {
          title: "Unassign Proposal",
          message: "Are you sure you want to unassign yourself from this proposal?",
          onConfirm: () => {
            try {
              const unassignData = {
                proposalId: props.proposalId,
                action: "unassign"
              };
              console.log("Unassignment requested:", unassignData);
              window.dispatchEvent(new CustomEvent("proposalUnassigned", { detail: unassignData }));
            } catch (error) {
              console.error("Failed to unassign proposal:", error);
            }
          }
        };
        showConfirmModal.value = true;
      };
      const closeAssignModal = () => {
        showAssignModal.value = false;
      };
      const confirmAssign = async () => {
        try {
          const assignData = {
            proposalId: props.proposalId,
            action: "responsible_person",
            autoStatus: "Considering"
            // Auto-change status to Considering
          };
          console.log("Assignment requested:", assignData);
          closeAssignModal();
          window.dispatchEvent(new CustomEvent("proposalAssigned", { detail: assignData }));
        } catch (error) {
          console.error("Failed to assign proposal:", error);
        }
      };
      const handleChangeVote = () => {
        if (!authStore.state.isAuthenticated) {
          showLoginPrompt("Please connect your wallet to change suggested votes.");
          return;
        }
        showVoteModal.value = true;
      };
      const closeVoteModal = () => {
        showVoteModal.value = false;
      };
      const saveVoteChange = async (data) => {
        try {
          const voteData = {
            proposalId: props.proposalId,
            vote: data.vote,
            reason: data.reason
          };
          console.log("Suggested vote change requested:", voteData);
          closeVoteModal();
          window.dispatchEvent(new CustomEvent("suggestedVoteChanged", { detail: voteData }));
        } catch (error) {
          console.error("Failed to update suggested vote:", error);
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
              title: voteButtonTooltip.value
            }, [
              createBaseVNode("span", _hoisted_11, toDisplayString(_ctx.suggestedVote || "No Suggested Vote"), 1)
            ], 8, _hoisted_10),
            createBaseVNode("button", {
              id: "voting-tool-team-actions",
              class: "control-btn team-btn",
              onClick: handleTeamActions,
              title: unref(authStore).state.isAuthenticated ? "Open team collaboration panel" : "Click to connect wallet for team actions"
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
            onClose: closeAssignModal,
            onConfirm: confirmAssign
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
  const VotingControls = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-69c1b12c"]]);
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
      const chain2 = this.getChainFromUrl();
      const title = this.extractProposalTitle();
      const titleElement = this.findTitleElement();
      const headerElement = this.findStatusBadgeLocation();
      if (!postId || !chain2) {
        return null;
      }
      return {
        postId,
        title,
        chain: chain2,
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
      const chain2 = this.getChainFromUrl();
      if (!chain2) return proposals;
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
          chain: chain2,
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
              chain: chain2,
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
              chain: chain2,
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
    async getProposalData(postId, chain2) {
      const cacheKey = `${chain2}-${postId}`;
      if (this.proposalCache.has(cacheKey)) {
        return this.proposalCache.get(cacheKey) || null;
      }
      const proposalData = await this.apiService.getProposal(postId, chain2);
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
      console.log("📝 Status change requested:", customEvent.detail);
      try {
        if (!this.apiService.isAuthenticated()) {
          console.error("❌ User not authenticated for manual status change");
          alert("Please connect your wallet to change proposal status.");
          return;
        }
        const currentProposal = this.detector.detectCurrentProposal();
        if (!currentProposal) {
          console.error("Could not determine current proposal for status change");
          return;
        }
        console.log(`🔄 Manual status change: ${proposalId} from "${currentProposal.chain}" to "${newStatus}"`);
        console.log(`🔐 Authentication status: ${this.apiService.isAuthenticated()}`);
        const result = await this.apiService.updateProposalStatus(
          proposalId,
          currentProposal.chain,
          newStatus
        );
        console.log(`📊 Manual status change result:`, result);
        if (result.success) {
          const cacheKey = `${currentProposal.chain}-${proposalId}`;
          const cachedData = this.proposalCache.get(cacheKey);
          if (cachedData) {
            cachedData.internal_status = newStatus;
            cachedData.updated_at = (/* @__PURE__ */ new Date()).toISOString();
            this.proposalCache.set(cacheKey, cachedData);
          }
          const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
          await this.updateExistingComponents(proposalId, updatedProposalData);
          console.log("✅ Status updated successfully in database");
        } else {
          console.error("❌ Failed to update status in database:", result.error);
          alert(`Failed to update status: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("❌ Error updating status in database:", error);
        alert("Failed to update status. Please check your connection and try again.");
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
      console.log("🗳️ Suggested vote change requested:", customEvent.detail);
      try {
        const currentProposal = this.detector.detectCurrentProposal();
        if (!currentProposal) {
          console.error("Could not determine current proposal for vote change");
          return;
        }
        const result = await this.apiService.updateSuggestedVote(
          proposalId,
          currentProposal.chain,
          vote,
          reason
        );
        if (result.success) {
          const cacheKey = `${currentProposal.chain}-${proposalId}`;
          const cachedData = this.proposalCache.get(cacheKey);
          if (cachedData) {
            cachedData.suggested_vote = vote;
            cachedData.reason_for_vote = reason;
            cachedData.updated_at = (/* @__PURE__ */ new Date()).toISOString();
            this.proposalCache.set(cacheKey, cachedData);
          }
          const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
          await this.updateExistingComponents(proposalId, updatedProposalData);
          console.log("✅ Suggested vote updated successfully in database");
        } else {
          console.error("❌ Failed to update suggested vote in database:", result.error);
          alert(`Failed to update suggested vote: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("❌ Error updating suggested vote in database:", error);
        alert("Failed to update suggested vote. Please check your connection and try again.");
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
      const { proposalId } = customEvent.detail;
      console.log("👤 Proposal unassignment requested:", customEvent.detail);
      try {
        const currentProposal = this.detector.detectCurrentProposal();
        if (!currentProposal) {
          console.error("Could not determine current proposal for unassignment");
          return;
        }
        if (!this.apiService.isAuthenticated()) {
          console.error("User not authenticated for unassignment");
          alert("Please authenticate to unassign proposals");
          return;
        }
        const result = await this.apiService.deleteTeamAction(
          proposalId,
          currentProposal.chain
        );
        if (result.success) {
          console.log("✅ Proposal unassigned successfully");
          const cacheKey = `${currentProposal.chain}-${proposalId}`;
          this.proposalCache.delete(cacheKey);
          const updatedProposalData = await this.getProposalData(proposalId, currentProposal.chain);
          await this.updateExistingComponents(proposalId, updatedProposalData);
        } else {
          console.error("❌ Failed to unassign proposal:", result.error);
          alert(`Failed to unassign proposal: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("❌ Failed to unassign proposal:", error);
        alert("Failed to unassign proposal. Please check your connection and try again.");
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
