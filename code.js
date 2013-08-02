function addCustomSorters() {
    //helper for sorter
    $.tablesorter.addParser({
        // set a unique id 
        id: 'html',
        is: function (s) {
            // return false so this parser is not auto detected 
            return false;
        },
        format: function (s) {
            // format your data for normalization 
            return $(s).attr('alt');
        },
        // set type, either numeric or text 
        type: 'text'
    });

    $.tablesorter.addParser({
        // set a unique id 
        id: 'salary',
        is: function (s) {
            // return false so this parser is not auto detected 
            return false;
        },
        format: function (s) {
            // format your data for normalization 
            return $(s).attr('absMax');
        },
        // set type, either numeric or text 
        type: 'numeric'
    });
}


$(document).ready(function () {
  addCustomSorters();
  showFirmsList();
  
  Galleria.loadTheme('galleria.simplecoding.js');
  showDetaislByName(document.location.hash);
  //showDetails(4);
  
  var gallery = $("#gallery");
});

var firms;

function showFirmsList()
{
    oFirmList =  new FirmList();
    oFirmList.fill();
}


function showDetaislByName(name)
{
    var index = -1;

    for (var i = 0; i < firms.length; i++) {
        if ("#" + firms[i].Name == name) {
            index = i;
        }
    }

    if (index >= 0) {
        showDetails(index);
    }
    else {
        document.location.href = document.location.pathname + "#home";
    }
}

function showDetails(firmIndex)
{
    if (firms.length < firmIndex)
        return;
    
    var firm = firms[firmIndex];
    $('#dataDetailsContainer').show();
    document.getElementById('firmname').innerHTML = firm.Name;
    
    if (firm.OfficialLogoLink != '')
    {
        document.getElementById('firmlogo').src = firm.OfficialLogoLink;
        $('#firmlogo').show();
    }
    else
    {
        $('#firmlogo').hide();    
    }
    
    var educationCenterHTML = generateEducationCenterView(firm.EducationCenterLink);
    document.getElementById('educationCenter').innerHTML = educationCenterHTML;
    
    var advantagesHTML = generateUnorderedArrayView(firm.Advantages);
    if (firm.Advantages.length > 0)
        advantagesHTML = '<h2>Бонусы</h2>' + advantagesHTML;
    
    document.getElementById('advantages').innerHTML = advantagesHTML; 
    
    if (firm.Advantages.length > 0)
    {
        $('#advantages').show();
    }
    else
    {
        $('#advantages').hide();    
    }
    
    var vacanciesHTML = generateVacanciesView(firm.Vacancies);
    document.getElementById('vacancies').innerHTML = vacanciesHTML;
    
    
    var videosHTML = generateUnorderedArrayViewAsLinks(firm.Videos);
    if (firm.Videos.length > 0)
        videosHTML = '<h2>Видео</h2>' + videosHTML;
        
    document.getElementById('videos').innerHTML = videosHTML;
   
    if (firm.Videos.length > 0)
    {
        $('#videos').show();
    }
    else
    {
        $('#videos').hide();    
    }
    
    if (firm.Photos.length > 0)
    {
        initGallery(firm);
        $('#gallery').show();
    }
    else
    {
        $('#gallery').hide();    
    }
    //debugger;
    document.location.href = document.location.pathname + "#" + firm.Name;

    $('#dataDetailsContainer').reveal();
};

function initGallery(firm){
    $("#gallery").galleria({
        data_source: firm.Photos,
        width: 530,
        height: 500,
        clicknext: true
    });
}

function generateEducationCenterView(educationCenterLink)
{
    var result = '';
    
    if (educationCenterLink != '')
    {
        result = '<a href="' + educationCenterLink + '"><img src="http://trop-nikul.zao.mos.ru/upload/iblock/478/cwilbkbn.jpg"/><br>Центр обучения</a> ';
    }
    
    return result;
}

function generateVacanciesView(items)
{
    var result = '<table id="vacancies" cellspacing="0" cellpadding="0">';
    result += '<thead><tr class ="even"><th>Языки платформы</th><th>Зарплата</th><th>Дата</th><th class="largeSizeColumn">Ссылки</th><th>Уровень</th></tr>';

    for (var i = 0; i < items.length; i++)
    {
	    var colorStyle = i % 2 ? 'even' : 'odd';
	    
        var vacancy = items[i];
        result += '<tr class="' + colorStyle +'">';
        result += '<td>' + generateUnorderedArrayView(vacancy.Directions) + '</td>';
        var salary;
        
        if (vacancy.ExpectedSalary == '0')
        {
            salary = '';
        }
        else if (vacancy.MaxSalary == '0')
        {
            salary = 'от ' + vacancy.MinSalary + ' т.р.';
        }
        else if (vacancy.MinSalary == '0')
        {
            salary = 'до ' + vacancy.MaxSalary + ' т.р.';
        }
        else if (vacancy.MaxSalary > vacancy.MinSalary)
        {
            salary = vacancy.MinSalary + ' - ' + vacancy.MaxSalary + ' т.р.';
        }
        else 
        {
            salary = vacancy.ExpectedSalary + ' т.р.';
        }
        result += '<td>' + salary + '</td>';
        result += '<td>' + vacancy.PublishDate.toLocaleDateString() + '</td>';
        
        result += '<td class="largeSizeColumn">' + generateUnorderedArrayViewAsLinks(vacancy.Links) + '</td>';
        
        if (vacancy.Level != 'All')
        {
            result += '<td>' + vacancy.Level + '</td>';
        }
        else
        {
            result += '<td></td>';
        }

        result += '</tr>';
    }

    result += '</table>';
		
    return result;
}


function generatePhotosView(items)
{
    var result = '';
    
    for (var i = 0; i < 1 /*items.length*/; i++)
    {
        result += '<img class="officeImg" src="'+ items[i] + '"><br>';
    }

    return result;
}

function generateSequenceDelimetedByComma(items)
{
    var result = '';
    
    if (items.length > 0)
    {
        result += items[0];
        for (var i = 1; i < items.length; i++)
        {
            result += ', ' + items[i];
        }
    }
    
    return result;
}

function generateUnorderedArrayViewAsLinks(items)
{
    var result = '<UL>';
    
    for (var i = 0; i < items.length; i++)
    {
        result += '<LI><a href="' + items[i] + '">' + items[i] + '</a></LI>';
    }
    result += '</UL>';
    
    return result;
}

function generateUnorderedArrayView(items)
{
    var result = '<UL>';
    
    for (var i = 0; i < items.length; i++)
    {
        result += '<LI>' + items[i] + '</LI>';
    }
    result += '</UL>';
    
    return result;
}

function checkDirection(direction, directions)
{
    for (var i = 0; i < directions.length; i++)
    {
        if (directions[i] == direction)
            return true;
    }

    return false;
}

function doFilter(items)
{
    var result = [];

    var salary = document.getElementById('salary').value;
    var direction = document.getElementById('directions').value;
    var district = document.getElementById('district').value;
    var vacancyActuality = document.getElementById('vacancyActuality').value;

    var isSalaryNotMeans = salary == "all";
    var isDirectionNotMeans = direction == "all";
    var isDistrictNotMeans = district == "all";
    var isVacancyActualityNotMeans = vacancyActuality == "all";
    
    var currentDate = new Date();
    var minActialityDate = currentDate;
    if (vacancyActuality == 'Год')
        minActialityDate.setYear(currentDate.getYear() - 1);
    else if (vacancyActuality == '3 месяца')
        minActialityDate.setMonth(currentDate.getMonth() - 3);
    else if (vacancyActuality == 'Месяц')
        minActialityDate.setMonth(currentDate.getMonth() - 1);
    else if (vacancyActuality == 'Неделя')
        minActialityDate.setDate(currentDate.getDate() - 7);

    for (var i = 0; i < items.length; i++)
    {    
        var firm = items[i];
        
        var isSalaryEquals = isSalaryNotMeans;
        var isDirectionEquals = isDirectionNotMeans;
        var isDistrictEquals = isDistrictNotMeans || district == firm.District;
        var isVacancyActual = isVacancyActualityNotMeans;
        
        if (!isDirectionEquals)
        {
            isDirectionEquals = checkDirection(direction, firm.Directions);
        }
    
        for (var j = 0; j < firm.Vacancies.length; j++)
        {
            var vacancy = firm.Vacancies[j];
            
            if (!isSalaryEquals)
            {
                isSalaryEquals = vacancy.MinSalary > salary || (vacancy.ExpectedSalary != 0 && vacancy.ExpectedSalary > salary) || vacancy.MaxSalary > salary;
            }
            
            if (!isDirectionEquals)
            {
                isDirectionEquals = checkDirection(direction, vacancy.Directions);
            }
            
            if (!isVacancyActual)
            {
                isVacancyActual = minActialityDate < vacancy.PublishDate;
            }
        }
    
        if (isSalaryEquals && isDirectionEquals && isDistrictEquals && isVacancyActual)
        {
            result.push(firm);
        }
        else
        {
            result.push(null);
        }
    }

    return result;
}

FirmList.prototype.fill = function ()
{
    firms = doFilter(this.Items);
    var content = '<table class="tablesorter" id="firms" cellspacing="0" cellpadding="0">';

	content += '<thead>';
	content += '<tr class="even">';
	content += '<th class="middleSizeColumn firstColumn">' + 'Название' + '</th>';
	content += '<th class="middleSizeColumn ">' + 'ЗП' + '</th>';
	content += '<th class="middleSizeColumn">' + 'Языки платформы' + '</th>';
	content += '<th class="middleSizeColumn">' + 'Направления' + '</th>';
	content += '<th class="bigSizeIconColumn" colspan="10">Ссылки</th>';
	content += '<th class="lastHeaderColumn">' + 'Фото' + '</th>';
	content += '</tr>'; 
	content += '</thead>';

	var rowIndex = 0;
	for(var i = 0; i < firms.length; i++)
	{
	    var firm = firms[i];
	    if (firm == null)
	        continue;
	        
	    var colorStyle = rowIndex % 2 ? 'even' : 'odd';
	    rowIndex++;
	    var addr = '<a target="blank" href="' + firm.AddressLink + '"><img alt="' + firm.Name + '" class="smallSizeColumn" src="http://www.clker.com/cliparts/N/3/C/c/M/f/pin-point-location-marker-purple-md.png"></a>';
	    var name = firm.Name;
	    var salary = 'xз';

	    var minSalary = 0;
	    var maxSalary = 0;
	    var avgSalary = 0;
	    var absMax = 0;

	    for (var j = 0; j < firm.Vacancies.length; j++) {
	        if (minSalary == 0) {
	            minSalary = firm.Vacancies[j].MinSalary;
	        }
	        else {
	            minSalary = Math.min(minSalary, firm.Vacancies[j].MinSalary);
	        }
	        maxSalary = Math.max(maxSalary, firm.Vacancies[j].MaxSalary);
	        avgSalary = Math.max(avgSalary, firm.Vacancies[j].ExpectedSalary);
        }

	    if ((minSalary > 0) && (maxSalary > 0)) {
	        salary = minSalary + ' &ndash; ' + maxSalary;
	        absMax = maxSalary;
	    }
	    else if (minSalary > 0) {
	        salary = minSalary + '++';
	        absMax = minSalary;
	    }
	    else if (maxSalary > 0) {
	        salary = '--' + maxSalary;
	        absMax = maxSalary;
	    }
	    else if (avgSalary > 0) {
	        salary = '~' + avgSalary;
	        absMax = avgSalary;
	    }
	    salary = '<div><div absMax="' + absMax + '">' + salary + '</div></div>'

	    if (firm.OfficialSiteLink.length > 0)
	    {
	        name = '<a target="blank" href="' + firm.OfficialSiteLink + '">' + firm.Name + '</a>';
	    }

	    content += '<tr class="datarow ' + colorStyle + '" onclick="showDetails(' + i + ')";>';
	    content += '<td class="middleSizeColumn firstColumn">' + addr + name + '</td>';
	    content += '<td class="middleSizeColumn">' + salary + '</td>';

		content += '<td class="middleSizeColumn">' + generateSequenceDelimetedByComma(firm.Directions) + '</td>';		
		content += '<td class="bigSizeColumn">' + firm.Regions + '</td>';			
		content += addImageLink("middleSizeIconColumn", "imageLink", firm.ODeskLink, "http://www.crowdconf2010.com/images/oDeskimg2.png");
		content += addImageLink("middleSizeIconColumn", "imageLink", firm.LinkedInLink, "http://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/200px-LinkedIn_Logo.svg.png");
		content += addImageLink("middleSizeIconColumn", "imageLink", firm.MoiKrugLink, "http://magazeta.com/wp-content/uploads/2007/11/moikrug.jpg");
		content += addImageLink("smallSizeIconColumn", "imageLink", firm.TwitterLink, "http://i1181.photobucket.com/albums/x427/kartnix/twitter-1.png");
		content += addImageLink("smallSizeIconColumn", "imageLink", firm.FacebookLink, "http://tb.ziareromania.ro/De-ce-nu-va-avea-Facebook-succes-in-China/7f66010028270c5649/240/0/1/70/De-ce-nu-va-avea-Facebook-succes-in-China.jpg");
		content += addImageLink("smallSizeIconColumn", "imageLink", firm.VkontakteLink, "http://cs10305.vkontakte.ru/g31480263/e_0c89034a.jpg");
		content += addImageLink("smallSizeIconColumn", "imageLink", firm.HeadHunterLink, "http://i.hh.ru/css/ambient/blocks/head/logo.png");
		content += addImageLink("middleSizeColumn", "imageLink", firm.EducationCenterLink, "http://trop-nikul.zao.mos.ru/upload/iblock/478/cwilbkbn.jpg");
		content += addImageLink("middleSizeColumn", "imageLink", firm.VirtualTaganrogLink, "http://profile.ak.fbcdn.net/hprofile-ak-snc6/c0.0.160.160/p160x160/277137_209952092395461_4585352_n.jpg");

		if (firm.Videos == '')
		    content += '<td class="smallSizeIconColumn"></td>'; 
		else
			content += '<td class="smallSizeIconColumn"> <img class="smallSizeColumn" src="http://www.russia-on.ru/wp-content/uploads/2012/11/YouTube.jpg"></td>';	

		if (firm.Photos == '')
		    content += '<td class="lastHeaderColumn"></td>'; 
		else
			content += '<td class="lastHeaderColumn"> <img class="smallSizeColumn" src="http://iconizer.net/files/Mnml/orig/camera.png"></td>';		

		content += '</tr>'; 
	}

	content += '</table>'; 

	var dataListContainer = document.getElementById('dataListContainer');
	dataListContainer.innerHTML = content;

    //add sorter
	$('#firms').tablesorter({
	    // передаем аргументы для заголовков и назначаем объект 
	    headers: {
	        0: {
	            sorter: 'html',
	        },
	        1: {
	            sorter: 'salary',
	        },
	        2: {
	            sorter: 'text',
	        },
	        3: {
	            sorter: 'text',
	        },
	        4: {
	            sorter: false
	        },
	        5: {
	            sorter: false
	        },
	        6: {
	            sorter: false
	        },
	        7: {
	            sorter: false
	        }
        }
	});

}

function addImageLink(tdClass, imageClass, link, imageLink)
{
    var result;
	if (link != '')
	    result = '<td class="' + tdClass + '"><a target="blank" href="' + link + '"/><img class="' + imageClass + '" src="' +imageLink + '"></img></a></td>';
	else
	    result = '<td class="' + tdClass + '"></td>';
    return result;
}
