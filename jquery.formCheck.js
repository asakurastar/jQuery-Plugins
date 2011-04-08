/*
 * jQuery Plugin - Form Checker
 * 
 * @author      Daniel dos Reis
 * @version     1.4
 * @description Plugin utilizado para validar campos obrigat�rios em um formul�rio
 * 
 * Formul�rio de Exemplo:
 * <form id="form" method="post" action="index.html">
 *   <input class="obrigatorio" type="text" name="pessoa" title="Pessoa" />
 *   <textarea class="obrigatorio" name="descricao" title="Descri��o"></textarea>
 * </form> 
 *
 * Forma de uso
 * $('#form').formCheck({
 *   fldclass : 'obrigatorio', //O nome da classe utilizada pelos campos de preenchimento obrigat�rios
 *   attrb : 'title', //O Atributo utilizado para representar o nome do campo
 *   errMsg : '� obrigat�rio o preenchimento do campo %campo%', //Mensagem a ser exibida (A vari�vel %campo% retorna o nome do campo em quest�o)
 *   errBox : '#aviso', //O elemento do qual ser� exibido as mensagens de erros
 *   output : 'html' //Especifica se as mensagens de erros ser�o exibidas em um elemento (html) definido em errBox ou via alerta de Javascript (alert)
 * });
 *
 * O Valor de retorno � True ou False
 */
 
(function($){
	$.fn.extend({
		formCheck : function(settings) {
			var msg = Array();
			var config = { 
				fldclass : 'obrigatorio',
				attrb : 'title',
				errMsg : '<p>O Campo <b>%campo%</b> deve ser preenchido</p>',
				errBox : '#top',
				output : 'html'
			};
		  
			if (settings) { $.extend(config,settings); }
		  
			this.find('input, textarea, select').each(function() {
				if ($(this).attr(config.attrb) != "" && $(this).hasClass(config.fldclass)) { 
					if ($.trim($(this).val()) == "") { msg.push(config.errMsg.replace("%campo%", $(this).attr(config.attrb))); }
				}
				
				else if ($(this).attr("name") != "" && $(this).hasClass(config.fldclass)) {
					if ($.trim($(this).val()) == "") { msg.push(config.errMsg.replace("%campo%", $(this).attr("name"))); }
				}
				
				else {
					if ($.trim($(this).val()) == "") { msg.push("-"); }
				}
			});

			if (msg.length > 0) { 
				if (config.output == 'html') {
					for (i in msg) { $(config.errBox).append(msg[i]); } 
				}
				
				else {
					var temp = "";
					for (i in msg) { temp += msg[i]+"\n"; }
					alert(temp);
				}
			}

			return (!msg.length > 0);
		}
	});
})(jQuery);