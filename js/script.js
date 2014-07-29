$(document).ready(function(){
	count=0;
	time=1;
	timer_start=null;

	
	/**
	 * Ввод имени пользователя
	 */
	function afterEnterName(event){
	      if(event.which==13 || event.which==1){
		    if($(this).val().length>=3){
			  $.data(document,'player_name',$(this).val());
			  $(this).parent().fadeOut();
			  $('.center_button').fadeIn();
		    }
	      }
	}
	$('.enter_name').click(afterEnterName);
	$('.enter_name').keypress(afterEnterName);
	
	/*
	 * Генериция картинок
	 */
	$('#pole').css('background',"url('img/back/back_"+Math.ceil(Math.random()*3)+".jpg')");
	
	
	/*
	 * Позиционирование кнопок по центру
	 */
	function toCenter(elem){
	    $(elem).css('left',($(window).width()-$(elem).outerWidth())/2+'px');
	    $(elem).css('top',($(window).height()-$(elem).outerHeight())/2+'px');
	}
	toCenter('.center_button');
	toCenter('.gamestart_block');
	
	$(window).resize(function (){
			toCenter('.center_button');
			toCenter('.gamestart_block');
			toCenter('.score_table');
	});
	
	// Подсчет баллов
	function schetchik(){
		count++;
		$('#schetchik').text( + count);
	}
	
	// При наведении на элемент, новый шаг
	function step(){
	
	//Уничтожение старого круга
		$('#kvadrat_'+count).unbind('mouseover');
		$('#kvadrat_'+count).stop(true,false);
		
		$('#schetchik').animate({ boxShadow : "0px 0px 40px #fff",backgroundColor:"rgba(255,255,255,0.4)",fontSize:'42px'  },100)
				.animate({ boxShadow : "0px 0px 10px #fff",backgroundColor:"rgba(255,255,255,0.1)",fontSize:'32px' },80); 
		
				
		$('#kvadrat_'+count).animate({left:$(window).width()-600+'px',
					      top:$(window).height()-400+'px',
					      width:'1000px',
					      height:'1000px',
					      opacity:0.6,
					      boxShadow: "0px 0px 100px #fff"
		},500,'easeInExpo');	
		//$('#kvadrat_'+count).animate({ boxShadow : "0px 0px 40px #fff" },100); 
		$('#kvadrat_'+count).fadeOut(500);
		
		schetchik();
		novykvadrat();
		
		clearTimeout(timer_start);
		startTimer();
		
	}
	
	// Создание нового квадрата
	function novykvadrat() {
	    $('body').append("<div class='kvadrat' id = 'kvadrat_"+count+"'></div>"); 
		
		$('#kvadrat_'+count).mouseover(step);
		var size = 15+Math.ceil(Math.random()*30)+'px';
		$('#kvadrat_'+count).css({'width':size,'height':size});
		$('#kvadrat_'+count).fadeIn(300);
		$('#kvadrat_'+count).animate({top: '+=100px',left: '+=100px'},10000/Math.pow((count+1),0.4),'linear');
		$('#kvadrat_'+count).css({top: Math.round(Math.random()*(window.innerHeight-160)+80)+'px',
						left: Math.round(Math.random()*(window.innerWidth-160))+80+'px'});
		 $("#animtime").css	({width: '0px'});
	}
	
	// Шаг таймера
	function timer(){
	  $("#animtime").stop();
	  $('#time').html("<span id='animtime'></span>");
	  $("#animtime").animate({width: '300px'},10000/Math.pow((count+1),0.4),'linear');
      // $('#time').html("Время: " + time);
	   if (time==0){
			clearTimeout(timer_start);
			$('#time').html("Время вышло!");
			$('.kvadrat').remove();
			$('#kvadrat_'+count).fadeOut(300);
			$('#pole').stop(false,false);
			
 			//Запрашиваем данные игры 
			$.ajax({
			  type: 'POST',
			  url: 'game.php',
			  data: 'name='+$.data(document,'player_name')+'&score='+count,
			  success: function(data){
			    $('.score_table').remove();
			    $('body').append(data);
			    toCenter('.score_table');
			    $('.score_table').fadeIn(300);
			    $('.new_game').click(function(){
				  $('.score_table').fadeOut(300);
				  $('.center_button').fadeIn(300);
			    });
			  }
			});
			
			count=0; 
		}else{
			time--;
		}  		
	}
	
	// Запауск таймера
	function startTimer(){
		time=1;
		timer();
		timer_start=setInterval(timer, 10000/Math.pow((count+1),0.4));
	}
	
	// Старт игры
	$('.center_button').click(function (){
		count=0;
		$('.center_button').fadeOut(300);
		//$('#pole').animate({'background-position-x': '+=500000px','background-position-y': '+=500000px'},1000000,'linear');
		
		$('#pole').animate({ 'border-spacing': 100000},
		{
		  step: function(now, fx) {
		    $(fx.elem).css("background-position", now+"px "+now+"px");
		  },
		  duration: 500000
		});
		
		
		$('#schetchik').html(count);
		if(timer_start!=null){
			clearTimeout(timer_start);
		}
		novykvadrat();
		$('#schetchik').innerHTML =  + count;
		startTimer();
	});
});