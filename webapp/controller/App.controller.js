sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/XMLTemplateProcessor",
	"sap/ui/core/util/XMLPreprocessor",
	"sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, XMLTemplateProcessor, XMLPreprocessor, JSONModel) {
		"use strict";

		return Controller.extend("com.gr.xmltemplate.controller.App", {
			onInit: function () {
				var oModel = this.getOwnerComponent().getModel();
				sap.ui.xmlfragment = (function (fnXMLFragment) {
					return function (sId, vFragment, oController) {
						if (typeof (sId) === "string") {
							return fnXMLFragment(sId, vFragment, oController);
						} else if (sId.fragmentName && sId.preprocessors && sId.preprocessors.xml) {
							var oFragment = XMLTemplateProcessor.loadTemplate(sId.fragmentName, "fragment");
							if (oFragment) {
								oFragment = XMLPreprocessor.process(oFragment, {
									caller: "XML-Fragment-templating"
								}, sId.preprocessors.xml);
								return fnXMLFragment({
									fragmentContent: oFragment
								}, vFragment);
							}
						} else {
							return fnXMLFragment(sId, vFragment, oController);
						}
					};
				})(sap.ui.xmlfragment);

				var oMetaModel = oModel.getMetaModel();
				oMetaModel.loaded().then(function () {
					var oModel = new JSONModel({
						"results": []
					});
					oModel.setProperty("/results", this.getOwnerComponent().getModel().getMetaModel().getMetaContext("/Regions").getModel().getProperty("/dataServices/schema/0/entityType/7/property"));
					this.getView().setModel(oModel, "fields");
					var oFragment = sap.ui.xmlfragment({
						fragmentName: "com.gr.xmltemplate.fragment.TableTemplate",
						async: true,
						preprocessors: {
							xml: {	
								models: {
									fields: oModel
								}
							}
						}
					}, this);
					this.getView().byId("page").destroyContent();
					this.getView().byId("page").addContent(oFragment);
				}.bind(this));

			}
		});
	});
