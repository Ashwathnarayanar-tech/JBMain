require([
		"modules/jquery-mozu",
		"hyprlive",
		"modules/backbone-mozu",
		"modules/api"], function ($, Hypr, Backbone, api, util) {


			//setting and formatting list of filter parameters to work with the api call
			var filterParams = [];
		
			function filterParamsKibo() {
				var kiboFilter = [];
				if (filterParams.length === 0) return "";
				for(var i = 0; i < filterParams.length; i++) {
					if (i === 0) {
						kiboFilter[i] = "attributes cont " + filterParams[i];
					} else {
						kiboFilter[i] = " and attributes cont " + filterParams[i];
					}
				}
				var joinedFilters = kiboFilter.join('').toLowerCase();
				return joinedFilters;
			}

			//api call to pull products from entity list
			function getProdList(pageNum) {
				if (pageNum === undefined || pageNum === "") pageNum = 1;
				var index = 0;
				if (pageNum !== 1) index = ((pageNum-1)*25);
				var prodList = [];
				var filter = filterParamsKibo();
				api.get('entity', {
				"listName" : "info-matrix",
				"entityListFullName" : "info-matrix@jbelly",
				"startIndex": index,
				"pageSize": 25,
				"sortBy": "SKU desc",
				"filter": filter
				}).then(function(response) {
            var startIndex = response.data.startIndex;
            var pageSize = response.data.pageSize;
            var totalItems = response.data.totalCount;
						prodList.push(response.data.items);
						var productList = prodList;
						var productListOnLoad = productList[0];
						$('#results-items').text("Found "+totalItems+" products with "+filterParams.length+(filterParams.length === 1 ? " filter applied." : " filters applied."));
						displayProducts(productListOnLoad, startIndex, pageSize, totalItems);
				});
			}

			function hasFilter() {
				if (filterParams.length === 0) {
					$("#result-item-section").addClass("hidden");
					$(".pagination").addClass("hidden");
					$(".pagination_bottom").addClass("hidden");
					$("#matrix-message").addClass("hidden");
				} else{
					$("#matrix-message").removeClass("hidden");
					$("#result-item-section").removeClass("hidden");
					$(".pagination").removeClass("hidden");
					$(".pagination_bottom").removeClass("hidden");
					getProdList();
				}
			}
		
			$(document).ready(function() {
				hasFilter();
			});
					
			//list each product attribute on the right-hand side of the page		
			function getLongAttributes (productAttrs, itemNum) {
				var appliedFilters = [];
				$("#listedFilters" +itemNum[0]).html("<span class='attrsLong'></span>");
				var attrObj = {KOSHER1: "Kosher", GLUTENFREE1: "Gluten-free", GELATINFREE1: "Gelatin-free", EGGFREE1: "Egg-free", PEACHFREE1: "Peach-free", ORGANIC1: "Organic", 
				PEANUTFREE1: "Peanut-free", TREENUTFREE1: "Tree-Nut-free", DAIRYFREE1: "Dairy-free", COCONUTFREE1: "Coconut-free", STRAWBERRYFREE1: "Strawberry-free", DYEFREE1: "Dye-free",
				FATFREE1: "Fat-free", SOYFREE1: "Soy-free", PINEAPPLEFREE1: "Pineapple-free", SHELLFISHFREE1: "Shellfish-free"};
				for (var i = 0; i <= Object.keys(attrObj).length; i++) {
					if (productAttrs.includes(Object.keys(attrObj)[i])) { appliedFilters.push(Object.values(attrObj)[i]); }
				}
				$(".attrsLong").text(appliedFilters.join(", "));
			}
			
			// Polpulate filter_params with the most up-to-date filters applied 
				$(".matrix-filter").click(function(event) {
					var current_filter = event.target.id + "1";
					var current_id = event.target.id;
					if ($('#'+current_id).is(':checked')) {
						filterParams.push(current_filter);
					} else {
						filterParams = filterParams.filter(function(item) {
							return item !== current_filter;
						});
					}
					hasFilter();
					console.log(filterParams.length);
				});
			
			//display the products on the page as a paginated list
			function displayProducts(productsToDisplay, startIndex, pageSize, totalItems) {
				function noProducts() {
					$('#result-item-section').html(
						// "<img src='https://cdn-tp1.mozu.com/9046-m1/cms/files/38e89f42-31f9-44d8-bef4-2db886977885' style='margin:auto; margin: 3em 0 1em 0; width: 25%;'>
						"<h3 class='no-products' style='text-align: center'> There are no products which meet your search criteria.<br /> Please remove a filter or two and try again! </h3>"
					);
					$(".pagination").addClass("hidden");
					$(".pagination_bottom").addClass("hidden");
					$("#matrix-message").addClass("hidden");
				}
				
				var currentPage = 1;
				if (startIndex !== 0) currentPage = (startIndex / pageSize) + 1;
					
				function prevPage() {
        if (currentPage > 1) {
						var $root = $('html, body');
            currentPage--;
						getProdList(currentPage);
						$root.animate({
							scrollTop: $('#matrix-message').offset().top -160
						}, 500);
          }
				}
				$('.btn_prev').unbind().click(function(){prevPage(); return false;});
				$('.btn_prev_bottom').unbind().click(function(){prevPage(); return false;});

				function nextPage() {
          if (currentPage < numPages()) {
						var $root = $('html, body');
            currentPage++;
						getProdList(currentPage);
						$root.animate({
							scrollTop: $('#matrix-message').offset().top -160
						}, 500);
					}
				}
				$('.btn_next').unbind().click(function(){nextPage(); return false;});
				$('.btn_next_bottom').unbind().click(function(){nextPage(); return false;});
					
					var btn_next = document.querySelector(".btn_next");
					var btn_prev = document.querySelector(".btn_prev");
					var btn_next_bottom = document.querySelector(".btn_next_bottom");
					var btn_prev_bottom = document.querySelector(".btn_prev_bottom");
          var listing_table = document.getElementById("result-item-section");
					var page_span = document.querySelector(".pages");
					var page_span_bottom = document.querySelector(".pages_bottom");
		
					if (currentPage < 1) currentPage = 1;
					if (currentPage > numPages()) currentPage = numPages();
		
					listing_table.innerHTML = '';
					if (productsToDisplay.length > 0) {
						for (var i = 0; i < productsToDisplay.length && (i < currentPage*pageSize); i++) {
							var item = document.createElement('div');
							item.setAttribute('class', 'result-item');
							item.setAttribute('id', 'item-' + (i + 1));
							$(item).append(
										// "<div class='img-container'>" + "<a href=/p/"+productsToDisplay[i].SKU+">"+"<img class='ing-matrix-thumb' src=\"" + productsToDisplay[i].image + "\" alt='placebear image'>" + "</a></div>",
										"<a class='item-link' href='/p/"+productsToDisplay[i].SKU+"'>"+ productsToDisplay[i].name + ", SKU: " + productsToDisplay[i].SKU + "</a>",
										"<span class='filters-box' id='listedFilters"+[i]+"'></span>",
								"<hr />"
							);
							$('#result-item-section').append(item);
							getLongAttributes(productsToDisplay[i].attributes, [i]);
						} 
					}	else {
						noProducts();
					}
		
					page_span.innerHTML = totalItems !== 0 ? "Page: " + currentPage + " / " + numPages() + ", Results " + (currentPage === 1 ? 1 : ((currentPage - 1) * 25) + 1) + " - " + (currentPage === numPages() ? totalItems : (currentPage * 25)) : "";
					page_span_bottom.innerText = page_span.innerText;

					if (currentPage == 1) {
						btn_prev.style.visibility = "hidden";
						btn_prev_bottom.style.visibility = "hidden";
          } else {
						btn_prev.style.visibility = "visible";
						btn_prev_bottom.style.visibility = "visible";
          }
					
          if (currentPage == numPages()) {
						btn_next.style.visibility = "hidden";
						btn_next_bottom.style.visibility = "hidden";
          } else {
						btn_next.style.visibility = "visible";
						btn_next_bottom.style.visibility = "visible";
					}

					
							
				function numPages() {
					return Math.ceil(totalItems / pageSize);
				}
				if (totalItems === 0) noProducts();
		
			}
			


});
