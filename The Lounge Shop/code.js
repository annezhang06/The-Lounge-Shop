/*
* (Most) VARIABLES:
*/

/// Parallel lists that hold onto inventory

//Sweatshirts//
var sweatshirtsProductNames = getColumn("Sweatshirts inventory", "Product_name");
var sweatshirtsImages = getColumn("Sweatshirts inventory", "Image");
var sweatshirtsPrices = getColumn("Sweatshirts inventory", "Price");
var sweatshirtsColours = getColumn("Sweatshirts inventory", "Colour");
var sweatshirtsMaterials = getColumn("Sweatshirts inventory", "Materials");
var sweatshirtsSStocks = getColumn("Sweatshirts inventory", "S_stock"); //stocks of size small
var sweatshirtsMStocks = getColumn("Sweatshirts inventory", "M_stock"); //stocks of size medium
var sweatshirtsLStocks = getColumn("Sweatshirts inventory", "L_stock"); //stocks of size large
var sweatshirtsCustomizable = getColumn("Sweatshirts inventory", "Custom_option"); //whether each item is customizable

//Sweatpants//
var sweatpantsProductNames = getColumn("Sweatpants inventory", "Product_name");
var sweatpantsImages = getColumn("Sweatpants inventory", "Image");
var sweatpantsPrices = getColumn("Sweatpants inventory", "Price");
var sweatpantsColours = getColumn("Sweatpants inventory", "Colour");
var sweatpantsMaterials = getColumn("Sweatpants inventory", "Materials");
var sweatpantsSStocks = getColumn("Sweatpants inventory", "S_stock");
var sweatpantsMStocks = getColumn("Sweatpants inventory", "M_stock");
var sweatpantsLStocks = getColumn("Sweatpants inventory", "L_stock");
var sweatpantsCustomizable = getColumn("Sweatpants inventory", "Custom_option");

/// Parallel lists that hold onto purchases
var bagItemNames = [];
var bagImages = [];
var bagPrices = [];
var bagSizes = [];
var bagLSPs = []; //left-sleeve personalizations
var bagRSPs = []; //roght-sleeve personalizations
var bagULPs = []; //upper-leg personalizations
var bagBSPs = []; //backside personalizations
var bagQuantities = [];
var bagItemSubtotals = [];

/// Keeps track of whether sweatshirts or sweatpants are being shown in the store
var onScreenProductCategory;
/// Keeps track of the index of the product/item being displayed (in the store or in the bag)
var onScreenIndexShop;
var onScreenIndexBag;

/*
*
* SETUP
*
*/

onScreenProductCategory = "none";

/*
*
* EVENTS
*
*/

/// Rollover effects
homeScreenBigButtonRolloverEffect("shopSweatshirtsBtnH");
homeScreenBigButtonRolloverEffect("shopSweatpantsBtnH");
smallButtonRolloverEffect("sweatshirtsTabH");
smallButtonRolloverEffect("sweatpantsTabH");
smallButtonRolloverEffect("sweatshirtsTabS");
smallButtonRolloverEffect("sweatpantsTabS");
smallButtonRolloverEffect("sweatshirtsTabSC");
smallButtonRolloverEffect("sweatpantsTabSC");
smallButtonRolloverEffect("backToShopBtnCornerB");
smallButtonRolloverEffect("backToShopBtnCenterB");
smallButtonRolloverEffect("backToBagBtnCh");
smallButtonRolloverEffect("backToHomeBtnCo");

/// Button/tabs that go to the Sweatshirts "page"
toSweatshirtsEvent("shopSweatshirtsBtnH");
toSweatshirtsEvent("sweatshirtsTabH");
toSweatshirtsEvent("sweatshirtsTabS");
toSweatshirtsEvent("sweatshirtsTabSC");
toSweatshirtsEvent("backToShopBtnCornerB");
toSweatshirtsEvent("backToShopBtnCenterB");

/// Button/tabs that go to the Sweatpants "page"
toSweatpantsEvent("shopSweatpantsBtnH");
toSweatpantsEvent("sweatpantsTabH");
toSweatpantsEvent("sweatpantsTabS");
toSweatpantsEvent("sweatpantsTabSC");

/// Right and left arrow buttons for browsing clothing
shopRightButtonEvent("rightBtnS");
shopRightButtonEvent("rightBtnSC");
shopLeftButtonEvent("leftBtnS");
shopLeftButtonEvent("leftBtnSC");

/// Clicking "The Lounge Shop" from any screen, or the "Back to Lounge Shop home" button on the
/// confirmation screen brings the user to the homescreen
toHomeEvent("titleS");
toHomeEvent("titleSC");
toHomeEvent("titleB");
toHomeEvent("titleCh");
toHomeEvent("titleCo");
toHomeEvent("backToHomeBtnCo");

/// Changing the size from the size dropdown while browsing updates the
//"left in stock" label, "quantity" dropdown, and "add to bag" button as necessary
onEvent("sizeDropdownS","input",sizeChangeStockLabelUpdate);
onEvent("sizeDropdownSC","input",sizeChangeStockLabelUpdate);

/// Clicking the shopping bag icon opens the bag
toBagEvent("bagIconH");
toBagEvent("bagIconS");
toBagEvent("bagIconSC");
toBagEvent("backToBagBtnCh");

/// Adding a product to the bag
addToBagEvent("addToBagBtnS");
addToBagEvent("addToBagBtnSC");

/// Right arrow button on the bag screen
onEvent("rightBtnB","click",function(){
  if (onScreenIndexBag == bagItemNames.length-1){
    onScreenIndexBag = 0;
  }
  else{
    onScreenIndexBag++;
  }
  updateBagScreen();
});

/// Left arrow button on the bag screen
onEvent("leftBtnB","click",function(){
  if (onScreenIndexBag == 0){
    onScreenIndexBag = bagItemNames.length-1;
  }
  else{
    onScreenIndexBag--;
  }
  updateBagScreen();
});

/// Bag "x" button (removes the item on screen from the bag)
onEvent("deleteItemBtnB","click",function(){
  removeItem(bagItemNames,onScreenIndexBag);
  removeItem(bagImages,onScreenIndexBag);
  removeItem(bagPrices,onScreenIndexBag);
  removeItem(bagSizes,onScreenIndexBag);
  removeItem(bagLSPs,onScreenIndexBag);
  removeItem(bagRSPs,onScreenIndexBag);
  removeItem(bagULPs,onScreenIndexBag);
  removeItem(bagBSPs,onScreenIndexBag);
  removeItem(bagQuantities,onScreenIndexBag);
  removeItem(bagItemSubtotals,onScreenIndexBag);
  if (onScreenIndexBag == bagItemNames.length){
    onScreenIndexBag = bagItemNames.length-1;
  }
  updateBagScreen();
});

/// "Checkout" button
onEvent("checkoutBtnB","click",function(){
  if (getProperty("checkoutBtnB","background-color") == "black"){
    var subtotal = calculatedSubtotal();
    var GST = calculatedSubtotal()*0.05;
    var PST = calculatedSubtotal()*0.07;
    setScreen("checkoutScreen");
    setProperty("firstNameInputCh","background-color","rgb(242, 242, 242)");
    setProperty("firstNameInputCh","border-color","rgb(77, 87, 95)");
    setProperty("lastNameInputCh","background-color","rgb(242, 242, 242)");
    setProperty("lastNameInputCh","border-color","rgb(77, 87, 95)");
    setProperty("creditCardInputCh","background-color","rgb(242, 242, 242)");
    setProperty("creditCardInputCh","border-color","rgb(77, 87, 95)");
    setText("subtotalNumCh","$" + subtotal.toFixed(2));
    setText("GSTnumCh","$" + GST.toFixed(2));
    setText("PSTnumCh","$" + PST.toFixed(2));
    setText("totalNumCh","$" + (subtotal + GST + PST).toFixed(2));
  }
});

/// "Place Order" button (lets order be placed if the supplied info is valid)
onEvent("placeOrderBtnCh","click",function(){
  var validCreditCard = true;
  for (var i = 0; i < getText("creditCardInputCh").length; i++){
    if (isNaN(getText("creditCardInputCh").substring(i,i+1))){
      validCreditCard = false;
    }
  }
  if (getText("creditCardInputCh").length != 16){
    validCreditCard = false;
  }
  if (getText("firstNameInputCh") == "" || getText("lastNameInputCh") == "" || validCreditCard == false){
    prompt("Invalid first name, last name, and/or credit card number");
    if (getText("firstNameInputCh") == ""){
      setProperty("firstNameInputCh","background-color","rgb(254, 221, 221)");
      setProperty("firstNameInputCh","border-color","rgb(162, 39, 39)");
    }
    else{
      setProperty("firstNameInputCh","background-color","rgb(242, 242, 242)");
      setProperty("firstNameInputCh","border-color","rgb(77, 87, 95)");
    }
    if (getText("lastNameInputCh") == ""){
      setProperty("lastNameInputCh","background-color","rgb(254, 221, 221)");
      setProperty("lastNameInputCh","border-color","rgb(162, 39, 39)");
    }
    else{
      setProperty("lastNameInputCh","background-color","rgb(242, 242, 242)");
      setProperty("lastNameInputCh","border-color","rgb(77, 87, 95)");
    }
    if (validCreditCard == false){
      setProperty("creditCardInputCh","background-color","rgb(254, 221, 221)");
      setProperty("creditCardInputCh","border-color","rgb(162, 39, 39)");
    }
    else{
      setProperty("creditCardInputCh","background-color","rgb(242, 242, 242)");
      setProperty("creditCardInputCh","border-color","rgb(77, 87, 95)");
    }
  }
  else{
    bagItemNames = [];
    bagImages = [];
    bagPrices = [];
    bagSizes = [];
    bagLSPs = [];
    bagRSPs = [];
    bagULPs = [];
    bagBSPs = [];
    bagQuantities = [];
    bagItemSubtotals = [];
    setScreen("confirmationScreen");
  }
});

/*
*
* FUNCTIONS
*
*/

/// Rollover effect for the big buttons on the homescreen:
function homeScreenBigButtonRolloverEffect(buttonID){
  onEvent(buttonID,"mouseover",function(){
    setProperty(buttonID,"text-color","white");
    setProperty(buttonID,"background-color","black");
  });
  onEvent(buttonID,"mouseout",function(){
    setProperty(buttonID,"text-color","black");
    setProperty(buttonID,"background-color","white");
  });
}

/// Rollover effect for homeScreen "Sweatshirts"/"Sweatpants" tabs and all back buttons
function smallButtonRolloverEffect(buttonID){
  onEvent(buttonID,"mouseover",function(){
      setProperty(buttonID,"text-color","rgba(77, 87, 95, 0.8)");
    });
    onEvent(buttonID,"mouseout",function(){
      setProperty(buttonID,"text-color","rgb(77, 87, 95)");
    });
}

/// Runs when a "Sweatshirts" button (or tab) is clicked, if sweatshirts aren't already being displayed:
function toSweatshirtsEvent(sweatshirtsButtonID){
  onEvent(sweatshirtsButtonID,"click",function(){
    if (onScreenProductCategory != "sweatshirts"){
      //variable changes
      onScreenProductCategory = "sweatshirts";
      onScreenIndexShop = 0;
      //UI changes
      showElement("sweatshirtsTabUnderlineS");
      hideElement("sweatpantsTabUnderlineS");
      showElement("sweatshirtsTabUnderlineSC");
      hideElement("sweatpantsTabUnderlineSC");
      //screen update
      updateShopScreen();
    }
  });
}

/// Runs when a "Sweatpants" button (or tab) is clicked, if sweatpants aren't already being displayed:
function toSweatpantsEvent(sweatpantsButtonID){
  onEvent(sweatpantsButtonID,"click",function(){
    if (onScreenProductCategory != "sweatpants"){
      //variable changes
      onScreenProductCategory = "sweatpants";
      onScreenIndexShop = 0;
      //UI changes
      showElement("sweatpantsTabUnderlineS");
      hideElement("sweatshirtsTabUnderlineS");
      showElement("sweatpantsTabUnderlineSC");
      hideElement("sweatshirtsTabUnderlineSC");
      //screen update
      updateShopScreen();
    }
  });
}

/// Changes the product being displayed on screen when the right arrow button is clicked while browsing:
function shopRightButtonEvent(rightButtonID){
  onEvent(rightButtonID,"click",function(){
    if (onScreenProductCategory == "sweatshirts" && onScreenIndexShop < sweatshirtsProductNames.length-1){
      onScreenIndexShop++;
    }
    else if (onScreenProductCategory == "sweatpants" && onScreenIndexShop < sweatpantsProductNames.length-1){
      onScreenIndexShop++;
    }
    else{
      onScreenIndexShop = 0;
    }
    updateShopScreen();
  });
}

/// Changes the product being displayed on screen when the left arrow button is clicked while browsing:
function shopLeftButtonEvent(leftButtonID){
  onEvent(leftButtonID,"click",function(){
    if (onScreenProductCategory == "sweatshirts" && onScreenIndexShop == 0){
      onScreenIndexShop = sweatshirtsProductNames.length-1;
    }
    else if (onScreenProductCategory == "sweatpants" && onScreenIndexShop == 0){
      onScreenIndexShop = sweatpantsProductNames.length-1;
    }
    else{
      onScreenIndexShop--;
    }
    updateShopScreen();
  });
}

/// Runs when "The Lounge Shop" is clicked from any screen:
function toHomeEvent(titleLabelID){
  onEvent(titleLabelID,"click",function(){
    onScreenProductCategory = "none";
    setScreen("homeScreen");
  });
}

/// Runs when any shopping bag icon is clicked:
function toBagEvent(bagIconID){
  onEvent(bagIconID,"click",function(){
    onScreenProductCategory = "none";
    setScreen("bagScreen");
    onScreenIndexBag = 0;
    updateBagScreen();
  });
}

/// Runs the "Sweatshirts" or "Sweatpants" shop page is opened and when a browsing arrow is clicked
//The shop "page" updates accordingly, based on the item that needs to be displayed:
function updateShopScreen(){
  if (onScreenProductCategory == "sweatshirts" && sweatshirtsCustomizable[onScreenIndexShop] == false){
    conditionalShopScreenUpdate("sweatshirts",false);
  }
  else if (onScreenProductCategory == "sweatshirts" && sweatshirtsCustomizable[onScreenIndexShop] == true){
    conditionalShopScreenUpdate("sweatshirts",true);
    setProperty("customInput1SC","placeholder","Left sleeve personalization (Add $5.00)");
    setProperty("customInput2SC","placeholder","Right sleeve personalization (Add $5.00)");
  }
  else if (onScreenProductCategory == "sweatpants" && sweatpantsCustomizable[onScreenIndexShop] == false){
    conditionalShopScreenUpdate("sweatpants",false);
  }
  else if (onScreenProductCategory == "sweatpants" && sweatpantsCustomizable[onScreenIndexShop] == true){
    conditionalShopScreenUpdate("sweatpants",true);
    setProperty("customInput1SC","placeholder","Upper leg personalization (Add $5.00)");
    setProperty("customInput2SC","placeholder","Backside personalization (Add $10.00)");
  }
}

/// Runs when the size is changed from the dropdown while browsing:
function sizeChangeStockLabelUpdate(){
  var currentSize;
  if (onScreenProductCategory == "sweatshirts"&& sweatshirtsCustomizable[onScreenIndexShop] == false){ //if this is true, use the sweatshirt lists and shopScreen pg
    currentSize = getText("sizeDropdownS");
    if (currentSize == "S"){
      adjustDisplayToStock("sweatshirts","small",false);
    }
    else if (currentSize == "M"){
      adjustDisplayToStock("sweatshirts","medium",false);
    }
    else{
      adjustDisplayToStock("sweatshirts","large",false);
    }
  }
  else if (onScreenProductCategory == "sweatshirts" && sweatshirtsCustomizable[onScreenIndexShop] == true){
    currentSize = getText("sizeDropdownSC");
    if (currentSize == "S"){
      adjustDisplayToStock("sweatshirts","small",true);
    }
    else if (currentSize == "M"){
      adjustDisplayToStock("sweatshirts","medium",true);
    }
    else{
      adjustDisplayToStock("sweatshirts","large",true);
    }
  }
  else if (onScreenProductCategory == "sweatpants" && sweatpantsCustomizable[onScreenIndexShop] == false){
    currentSize = getText("sizeDropdownS");
    if (currentSize == "S"){
      adjustDisplayToStock("sweatpants","small",false);
    }
    else if (currentSize == "M"){
      adjustDisplayToStock("sweatpants","medium",false);
    }
    else{
      adjustDisplayToStock("sweatpants","large",false);
    }
  }
  else if (onScreenProductCategory == "sweatpants" && sweatpantsCustomizable[onScreenIndexShop] == true){
    currentSize = getText("sizeDropdownSC");
    if (currentSize == "S"){
      adjustDisplayToStock("sweatpants","small",true);
    }
    else if (currentSize == "M"){
      adjustDisplayToStock("sweatpants","medium",true);
    }
    else{
      adjustDisplayToStock("sweatpants","large",true);
    }
  }
}

/// Called in updateShopScreen with varying arguments; updates the screen correctly based on the particular arguments used
function conditionalShopScreenUpdate(clothingCategory,isCustomizable){
  var listSet = [];
  var screenSuffix;
  if (clothingCategory == "sweatshirts"){
    listSet = [sweatshirtsProductNames,sweatshirtsImages,sweatshirtsPrices,sweatshirtsColours,sweatshirtsMaterials,sweatshirtsSStocks];
  }
  else if (clothingCategory == "sweatpants"){
    listSet = [sweatpantsProductNames,sweatpantsImages,sweatpantsPrices,sweatpantsColours,sweatpantsMaterials,sweatpantsSStocks];
  }
  if (isCustomizable){
    setScreen("shopCustomScreen");
    screenSuffix = "SC";
  }
  else{
    setScreen("shopScreen");
    screenSuffix = "S";
  }
  setText("productName" + screenSuffix, listSet[0][onScreenIndexShop]);
  setImageURL("productImage" + screenSuffix, listSet[1][onScreenIndexShop]);
  setText("price" + screenSuffix, "$" + listSet[2][onScreenIndexShop].toFixed(2));
  setText("colour" + screenSuffix, "Colour: " + listSet[3][onScreenIndexShop]);
  setText("materials" + screenSuffix, listSet[4][onScreenIndexShop]);
  setProperty("sizeDropdown" + screenSuffix, "index", 0);
  adjustDisplayToStock(clothingCategory,"small",isCustomizable);
  setProperty("qtyDropdown" + screenSuffix, "index", 0);
  setText("productNum" + screenSuffix, (onScreenIndexShop + 1) + " of " + listSet[0].length);
}

/// Adjusts the on-screen "left in stock" label, "add to bag" button, and quantity dropdown
/// in the shop whenever the selected size of the item on screen, its stock in the selected size,
/// and or the item being displayed is changed
function adjustDisplayToStock(clothingCategory,size,isCustomizable){
  //setting variables to substitute based on parameters
  var stocksListToReference = [];
  var screenSuffix;
  if (clothingCategory == "sweatshirts"){
    if (size == "small"){
      stocksListToReference = sweatshirtsSStocks;
    }
    else if (size == "medium"){
      stocksListToReference = sweatshirtsMStocks;
    }
    else if (size == "large"){
      stocksListToReference = sweatshirtsLStocks;
    }
  }
  else if (clothingCategory == "sweatpants"){
    if (size == "small"){
      stocksListToReference = sweatpantsSStocks;
    }
    else if (size == "medium"){
      stocksListToReference = sweatpantsMStocks;
    }
    else if (size == "large"){
      stocksListToReference = sweatpantsLStocks;
    }
  }
  if (isCustomizable == false){
    setScreen("shopScreen");
    screenSuffix = "S";
  }
  else if (isCustomizable){
    setScreen("shopCustomScreen");
    screenSuffix = "SC";
  }
  //adjusting the UI stock label and add-to-bag button
  setText("stock" + screenSuffix, stocksListToReference[onScreenIndexShop] + " left in stock");
    if (stocksListToReference[onScreenIndexShop] <= 10){
      setProperty("stock" + screenSuffix,"text-color","red");
    }
    else{
      setProperty("stock" + screenSuffix,"text-color","black");
    }
    if (stocksListToReference[onScreenIndexShop] == 0){
      setProperty("addToBagBtn" + screenSuffix,"background-color","rgba(0,0,0,0.4)");
    }
    else{
      setProperty("addToBagBtn" + screenSuffix,"background-color","black");
    }
  //adjusting the quantity dropdown to only list what qtys are possible, up to 5
  var availableQtys = [];
  for (var i = 1; (i <= stocksListToReference[onScreenIndexShop] && i <= 5); i++){
    appendItem(availableQtys,i);
  }
  if (availableQtys.length == 0){
    availableQtys = [0];
  }
  setProperty("qtyDropdown" + screenSuffix,"options",availableQtys);
}

/// Bag displays items currently in the bag w/ all their specs, if there are any items:
/// Called when the bag is opened, when the user clicks through the bag, and when an item is removed from the bag
function updateBagScreen(){
  var hideAndShowElementsIDs = ["deleteItemBtnB","leftBtnB","rightBtnB","productNameB","productImageB","productPriceB","productSizeB","customizationLabel1B","customizationLabel2B","itemQuantityLabelB","itemSubtotalLabelB"];
  if (bagItemNames.length == 0){
    showElement("bagIsEmptyLabelB");
    showElement("backToShopBtnCenterB");
    setText("productNumB", "0 of 0");
    for (var i = 0; i < hideAndShowElementsIDs.length; i++){
      hideElement(hideAndShowElementsIDs[i]);
    }
    setText("subtotalNumB","$0.00");
    setProperty("checkoutBtnB","background-color","rgba(0, 0, 0, 0.25)");
    setProperty("checkoutBtnB","border-color","rgba(0,0,0,0)");
    setProperty("checkoutArrowIconB","icon-color","rgba(0,0,0,0.25)");
  }
  else{
    hideElement("bagIsEmptyLabelB");
    hideElement("backToShopBtnCenterB");
    for (var j = 0; j < hideAndShowElementsIDs.length; j++){
      showElement(hideAndShowElementsIDs[j]);
    }
    setProperty("checkoutBtnB","background-color","black");
    setProperty("checkoutBtnB","border-color","black");
    setProperty("checkoutArrowIconB","icon-color","black");
    //show specs
    setText("productNameB",bagItemNames[onScreenIndexBag]);
    setImageURL("productImageB",bagImages[onScreenIndexBag]);
    setText("productPriceB","Price: $" + bagPrices[onScreenIndexBag].toFixed(2) + " CAD");
    setText("productSizeB","Size: " + bagSizes[onScreenIndexBag]);
    if (bagLSPs[onScreenIndexBag] != null){
      setText("customizationLabel1B","LS prsnlztn (+$5): " + bagLSPs[onScreenIndexBag]);
      if (bagRSPs[onScreenIndexBag] != null){
        setText("customizationLabel2B","RS prsnlztn (+$5): " + bagRSPs[onScreenIndexBag]);
      }
      else{
        setText("customizationLabel2B","");
      }
    }
    else if (bagULPs[onScreenIndexBag] != null){
      setText("customizationLabel1B","UL prsnlztn (+$5): " + bagULPs[onScreenIndexBag]);
      if (bagBSPs[onScreenIndexBag] != null){
        setText("customizationLabel2B","BS prsnlztn (+$10): " + bagBSPs[onScreenIndexBag]);
      }
      else{
        setText("customizationLabel2B","");
      }
    }
    else if (bagRSPs[onScreenIndexBag] != null){
      setText("customizationLabel1B","RS prsnlztn (+$5): " + bagRSPs[onScreenIndexBag]);
      setText("customizationLabel2B","");
    }
    else if (bagBSPs[onScreenIndexBag] != null){
      setText("customizationLabel1B","BS prsnlztn (+$10): " + bagBSPs[onScreenIndexBag]);
      setText("customizationLabel2B","");
    }
    else{
      setText("customizationLabel1B","");
      setText("customizationLabel2B","");
    }
    setText("itemQuantityLabelB","Quantity: " + bagQuantities[onScreenIndexBag]);
    setText("itemSubtotalLabelB","Item subtotal: $" + bagItemSubtotals[onScreenIndexBag].toFixed(2) + " CAD");
    setText("productNumB", (onScreenIndexBag + 1) + " of " + bagItemNames.length);
    ///calculate subtotal w/ return and show on screen
    setText("subtotalNumB","$" + calculatedSubtotal().toFixed(2) + " CAD");
  }
}

/// Calculates the subtotal; called in the bag screen update function and checkout screen update function
function calculatedSubtotal(){
  var st = 0;
  for (var i = 0; i < bagItemSubtotals.length; i++){
    st = st + bagItemSubtotals[i];
  }
  return st;
}

/// When "add to bag" is clicked, the product on screen is added to the user's bag if that product is in stock
function addToBagEvent(buttonID){
  onEvent(buttonID,"click",function(){
    //checking if adding to bag is possible, based on stock and whether any personalizations are the right length
    var addable = false;
    if (getProperty(buttonID,"background-color") == "black"){
      addable = true;
      if (buttonID == "addToBagBtnSC" && (getText("customInput1SC").length > 25 || getText("customInput2SC").length > 25)){
        prompt("Personalizations cannot exceed 25 characters.");
        addable = false;
      }
    }
    if (addable){ //if addable, add the item on screen to the bag
      var productName = "";
      var productImage = "";
      var productPrice = 0;
      var sizeChoice = "";
      var LSP = "";
      var RSP;
      var ULP;
      var BSP;
      var quantity;
      var itemSubtotal;
      if (onScreenProductCategory == "sweatshirts"){
        productName = sweatshirtsProductNames[onScreenIndexShop];
        productImage = sweatshirtsImages[onScreenIndexShop];
        productPrice = sweatshirtsPrices[onScreenIndexShop];
        if (buttonID == "addToBagBtnSC"){
          sizeChoice = getText("sizeDropdownSC");
          quantity = getNumber("qtyDropdownSC");
          setProperty("qtyDropdownSC","index",0);
          itemSubtotal = productPrice * quantity;
          if (getText("customInput1SC") != ""){
            LSP = getText("customInput1SC");
            setText("customInput1SC","");
            itemSubtotal = itemSubtotal + 5 * quantity;
          }
          else{
            LSP = null;
          }
          if (getText("customInput2SC") != ""){
            RSP = getText("customInput2SC");
            setText("customInput2SC","");
            itemSubtotal = itemSubtotal + 5 * quantity;
          }
          else{
            RSP = null;
          }
          ULP = null;
          BSP = null;
        }
      }
      else if (onScreenProductCategory == "sweatpants"){
        productName = sweatpantsProductNames[onScreenIndexShop];
        productImage = sweatpantsImages[onScreenIndexShop];
        productPrice = sweatpantsPrices[onScreenIndexShop];
        if (buttonID == "addToBagBtnSC"){
          sizeChoice = getText("sizeDropdownSC");
          quantity = getNumber("qtyDropdownSC");
          setProperty("qtyDropdownSC","index",0);
          itemSubtotal = productPrice * quantity;
          if (getText("customInput1SC") != ""){
            ULP = getText("customInput1SC");
            setText("customInput1SC","");
            itemSubtotal = itemSubtotal + 5 * quantity;
          }
          else{
            ULP = null;
          }
          if (getText("customInput2SC") != ""){
            BSP = getText("customInput2SC");
            setText("customInput2SC","");
            itemSubtotal = itemSubtotal + 10 * quantity;
          }
          else{
            BSP = null;
          }
          LSP = null;
          RSP = null;
        }
      }
      if (buttonID == "addToBagBtnS"){
        sizeChoice = getText("sizeDropdownS");
        quantity = getNumber("qtyDropdownS");
        LSP = null;
        RSP = null;
        ULP = null;
        BSP = null;
        itemSubtotal = productPrice * quantity;
      }
      //change the stock of the item being bought (based on the quantity bought)
      var stocksListToChange; //////////might need to turn this into a function to use in the remove-from-bag func too
      if (onScreenProductCategory == "sweatshirts"){
        if (sizeChoice == "S"){
          stocksListToChange = sweatshirtsSStocks;
        }
        else if (sizeChoice == "M"){
          stocksListToChange = sweatshirtsMStocks;
        }
        else{
          stocksListToChange = sweatshirtsLStocks;
        }
      }
      else if (onScreenProductCategory == "sweatpants"){
        if (sizeChoice == "S"){
          stocksListToChange = sweatpantsSStocks;
        }
        else if (sizeChoice == "M"){
          stocksListToChange = sweatpantsMStocks;
        }
        else{
          stocksListToChange = sweatpantsLStocks;
        }
      }
      stocksListToChange[onScreenIndexShop] = stocksListToChange[onScreenIndexShop] - quantity;
      //adjust the screen to the new change in stock
      var isCustomizable;
      var size;
      if (buttonID == "addToBagBtnSC"){
        isCustomizable = true;
      }
      else{
        isCustomizable = false;
      }
      if (sizeChoice == "S"){
        size = "small";
      }
      else if (sizeChoice == "M"){
        size = "medium";
      }
      else{
        size = "large";
      }
      adjustDisplayToStock(onScreenProductCategory,size,isCustomizable);
      //append all the new variables to their respective bag lists
      var alreadyExists = false;
      for (var i = 0; i < bagItemNames.length; i++){
        if (productName == bagItemNames[i] && sizeChoice == bagSizes[i] && LSP == bagLSPs[i] && RSP == bagRSPs[i] && ULP == bagULPs[i] && BSP == bagBSPs[i]){
          alreadyExists = true;
          bagQuantities[i] = bagQuantities[i] + quantity;
          bagItemSubtotals[i] = bagItemSubtotals[i] + itemSubtotal;
        }
      }
      if (alreadyExists == false){
        appendItem(bagItemNames,productName);
        appendItem(bagImages,productImage);
        appendItem(bagPrices,productPrice);
        appendItem(bagSizes,sizeChoice);
        appendItem(bagLSPs,LSP);
        appendItem(bagRSPs,RSP);
        appendItem(bagULPs,ULP);
        appendItem(bagBSPs,BSP);
        appendItem(bagQuantities,quantity);
        appendItem(bagItemSubtotals,itemSubtotal);
      }
      //show the "added to bag" notification on screen
      var suffix;
      if (buttonID == "addToBagBtnSC"){
        suffix = "SC";
      }
      else{
        suffix = "S";
      }
      showElement("addedToBagAlert" + suffix);
      showElement("addedToBagBG" + suffix);
      setTimeout(function(){
        hideElement("addedToBagAlert" + suffix);
        hideElement("addedToBagBG" + suffix);
      }, 1000);
    }
  });
}
