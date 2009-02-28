/**
 * entries_control.js - entries controller
 * @author Ricardo Nishimura - 2008
 */
mlog.entriesControl = function(){
  var htmlTemplate = null;
  var storedSearches = [];
  var filterOptions = {};
  var hideSummary = false;

  /* default start date: begin prev month */
  var dtStart = mlog.base.addMonths(new Date, -1);
  dtStart.setDate(1);
  dtStart = mlog.base.dateToString(dtStart);
  /* default end date: next week */
  var dtEnd = new Date();
  dtEnd.setDate(dtEnd.getDate() + 7);
  dtEnd = mlog.base.dateToString(dtEnd);

  var resetFilterOptions = function(){
    filterOptions = {
      query: '',
      pageNumber: 1,
      entriesPerPage: 50,
      startDate: dtStart,
      endDate: dtEnd,
      values: 0,
      categories: [],
      accounts: [],
      sortColIndex: 0,
      sortReverse: true
    };
    $('#filter_date_from').val(filterOptions.startDate);
    $('#filter_date_until').val(filterOptions.endDate);
    $('#filter_query').val(filterOptions.query);
    $('#filter_values').val(filterOptions.values);
    mlog.entriesControl.updateTagCloud();
  };
  return {
    /* initialize template, completers, datepicker... */
    init: function(){
      if (!htmlTemplate) {
        /* trying to not generate any new markup, just get from html */
        /* break table rows */
        var rows = $('#summary_table').html().replace(/<\/tr>/gi, '</tr>!*!');
        rows = rows.split('!*!');
        /* remove nodes inside entries table */
        $('#summary_table tbody').remove();
        /* summary table: append a template hook */
        $('#summary_table').append(document.createTextNode("{summaryContent}"));
        var summaryTemplate = {
          tHead: rows[0],
          tRow: rows[1],
          tRowTotal: rows[2]
        };
        /* break table rows */
        rows = $('#entries_table').html().replace(/<\/tr>/gi, '</tr>!*!');
        rows = rows.split('!*!');
        /* remove nodes inside entries table */
        $('#entries_table tbody').remove();
        /* entries table: append a template hook */
        $('#entries_table').append(document.createTextNode("{entriesContent}"));
        var entriesTemplate = {
          tHead: rows[0],
          tRow: rows[1],
          tRowOdd: rows[1].replace(/row-a/, 'row-b'),
          tRowFuture: rows[1].replace(/row-a/, 'row-a row_future'),
          tRowFutureOdd: rows[1].replace(/row-a/, 'row-b row_future'),
          tRowTotal: rows[2]
        };
        htmlTemplate = {
          summary: summaryTemplate,
          entries: entriesTemplate,
          main: $('#main_entries').html()
        };
        $('#main_entries').html('');

        mlog.entries.getAll(); /* initialize data */
        /* autocomplete options */
        var acOptions = {
          minChars: 0,
          max: 50,
          selectFirst: false,
          multiple: true,
          multipleSeparator: '  '
        };
        /* category autocomplete */
        $('#input_category').autocomplete(mlog.categories.getNames(), {
          minChars: 0,
          max: 50,
          selectFirst: false,
          multiple: true,
          multipleSeparator: mlog.base.categorySeparator
        });
        /* from account autocomplete */
        $('#input_account').autocomplete(mlog.accounts.getNames(), acOptions);
        $('#input_account').result(function(){
          /* on accept jump to: */
          if ($('#input_category').val() != '') {
            if (!$.browser.opera)
              $('#form_entry button')[0].focus();
          }
          else {
            $('#input_account_to').focus().select();
          }
        });
        /* to account autocomplete */
        $('#input_account_to').autocomplete(mlog.accounts.getNames(), acOptions);
        $('#input_account_to').result(function(){
          /* on accept jump to: */
          if (!$.browser.opera)
            $('#form_entry button')[0].focus();
        });
        /* initialize datepicker */
        Calendar.setup({
          inputField: "input_date",
          ifFormat: "%Y-%m-%d",
          weekNumbers: false
        });
        Calendar.setup({
          inputField: "filter_date_from",
          ifFormat: "%Y-%m-%d",
          weekNumbers: false
        });
        Calendar.setup({
          inputField: "filter_date_until",
          ifFormat: "%Y-%m-%d",
          weekNumbers: false
        });
        /* attach on blur event for account transfers */
        $('#input_account').focus(this.toggleToAccount);
        /* fill filter autocomplete */
        storedSearches = mlog.base.getCookie('storedSearches').split('~');
        $('#filter_query').autocomplete(storedSearches, {
          minChars: 0,
          max: 50,
          selectFirst: false
        })
        /* initial date value */
        $('#input_date').val(mlog.base.getCurrentDate());
        /* auto clear form configuration */
        if (mlog.base.getCookie('entryFormAutoClear') == 'true') {
          $('#input_auto_clear').attr('checked', 'true');
        }
        else {
          $('#input_auto_clear').attr('checked', '');
        }
        $('#input_auto_clear').click(function(){
          if ($('#input_auto_clear').attr('checked') == true) {
            mlog.base.setCookie('entryFormAutoClear', 'true');
          }
          else {
            mlog.base.setCookie('entryFormAutoClear', 'false');
          }
        });
        resetFilterOptions();
        this.clearEntry();
      }
    },

    /* display an entry to input */
    updateInputEntry: function(lineData){
      if (!lineData) {
        return;
      }
      $('#input_date').val(lineData[0]);
      $('#input_value').val(mlog.base.floatToString(lineData[1]));
      $('#input_description').val(lineData[2]);
      $('#input_category').val(lineData[3] || '');
      $('#input_account').val(lineData[4] || '');
      if (lineData[6]) {
        $('#input_pending').attr('checked', 'true');
      }
      else {
        $('#input_pending').attr('checked', '');
      }
    },
    /* remove an entry */
    removeEntry: function(elem){
      var lineId = elem.parentNode.parentNode.getAttribute('id').substring(2);
      if (confirm(mlog.translator.get('delete').toUpperCase() + ': ' + mlog.translator.get('are you sure?'))) {
        var lineData = mlog.entries.remove(lineId);
        this.show();
        mlog.entriesControl.updateTagCloud();
        this.updateInputEntry(lineData);
      }
    },
    /* prepare a selected row to be edited */
    startRowEdit: function(elem){
      var lineId = '#' + elem.parentNode.parentNode.getAttribute('id');
      /* clear any previous preparation to edit */
      if ($('#input_date_row').length > 0)
        this.show();
      var row = $(lineId);
      var isReconcilable = row.hasClass('row_reconcilable');
      var cols = row.children();
      var col, pval;

      /* date col */
      col = $(cols[0]);
      col.unbind();
      pval = $.trim(col.html());
      pval += (isReconcilable) ? '?' : '';
      col.html('<input id="input_date_row" class="input_row" type="text" value="' + pval + '" />');
      /* datepicker */
      Calendar.setup({
        inputField: "input_date_row",
        ifFormat: "%Y-%m-%d",
        weekNumbers: false
      });

      /* value col */
      col = $(cols[1]);
      col.unbind();
      pval = $(col.children()).html();
      col.html('<input id="input_value_row" class="input_row" type="text" value="' + pval + '" />');

      /* description col */
      col = $(cols[2]);
      col.unbind();
      pval = col.html();
      col.html('<input id="input_description_row" class="input_row" type="text" value="' + pval + '" />');

      /* category col */
      col = $(cols[3]);
      col.unbind();
      pval = col.html();
      col.html('<input id="input_category_row" class="input_row" type="text" value="' +
      pval +
      '" /><div class="suggest_list" id="category_list_row" style="display:none"></div>');
      /* autocomplete */
      $('#input_category_row').autocomplete(mlog.categories.getNames(), {
        minChars: 0,
        max: 50,
        selectFirst: false,
        multiple: true,
        multipleSeparator: mlog.base.categorySeparator
      });

      /* account col */
      col = $(cols[4]);
      col.unbind();
      pval = col.html();
      col.html('<input id="input_account_row" class="input_row" type="text" value="' +
      pval +
      '" /><div class="suggest_list" id="account_list_row" style="display:none"></div>');
      /* autocomplete */
      $('#input_account_row').autocomplete(mlog.accounts.getNames(), {
        minChars: 0,
        max: 50,
        selectFirst: false,
        multiple: true,
        multipleSeparator: '  '
      });

      /* option col */
      col = $(cols[5]);
      col.html('<span class="opt_cancel" onclick="mlog.entriesControl.show()">&nbsp;</span>&nbsp;' +
      '<span class="opt_ok" onclick="mlog.entriesControl.applyRowEdit(this)">&nbsp;</span>');

    },
    applyRowEdit: function(elem){
      var lineId = elem.parentNode.parentNode.getAttribute('id').substring(2);
      var lineData = mlog.entries.remove(lineId);
      var entry = [$('#input_date_row').val(), $('#input_value_row').val(), $('#input_description_row').val(), $('#input_category_row').val(), $('#input_account_row').val(), ''];
      var addCount = mlog.entries.getCount();
      mlog.entries.add(entry);
      /* refresh entries */
      this.show();
      /* stylise new entry */
      $('#n_' + (addCount)).addClass('new_entry');
    },
    /* display on input when clicked */
    onClickEntry: function(elem){
      var id = elem.parentNode.getAttribute('id').substring(2);
      this.updateInputEntry(mlog.entries.get(id));
      $('#input_date').focus();
      $('#transfer').hide();
    },
    /* build summary */
    getSummary: function(){
      var res = [];
      var tpSum = htmlTemplate.summary;
      /* build summary */
      res.push(tpSum.tHead);
      var accounts = mlog.accounts.getAllwithTotal();
      var maxValue = 0;
      // find maxValue
      for (var i = 0; i < accounts.length - 1; i++) {
        if (accounts[i][0] != '' && accounts[i][1] != 0) {
          maxValue = Math.abs(accounts[i][1]) > maxValue ? Math.abs(accounts[i][1]) : maxValue;
        }
      }
      maxValue = maxValue >= 100 ? maxValue : 100; /* at least more then 100 */
      for (i = 0; i < accounts.length; i++) {
        var strRow = (i < accounts.length - 1) ? tpSum.tRow : tpSum.tRowTotal;
        if (accounts[i][0] != '') {
          strRow = strRow.replace(/{account_id}/, accounts[i][0]);
        }
        else {
          if (accounts[i][1] == 0) {
            continue; /* if account and value are empty, move next */
          }
          strRow = strRow.replace(/{account_id}/, '-');
        }
        /* bar style */
        strRow = strRow.replace(/class="pos"|class=pos/, (accounts[i][1] < 0 ? 'class="neg"' : 'class="pos"'));
        /* bar width */
        strRow = strRow.replace(/99/, Math.abs(Math.round(accounts[i][1]) / maxValue * 100));
        /* account total */
        strRow = strRow.replace(/{account_total}/, mlog.base.formatFloat(accounts[i][1]));
        res.push(strRow);
      }
      return res.join('');
    },
    /* display the entries */
    show: function(page){
      mlog.entriesControl.init();
      mlog.base.activateMenu('entries');
      filterOptions.pageNumber = (typeof page == 'number') ? page : 1;

      /* just make sure to remove row autocomplete */
      $('#input_category_row').unautocomplete();
      $('#input_account_row').unautocomplete();

      var theTotal = 0;
      var res = '';
      var theData = mlog.entries.getByFilter(filterOptions);
      var currentDate = mlog.base.getCurrentDate();
      var strRow = '';
      var tp = htmlTemplate.entries;
      var content = htmlTemplate.main;
      var odd = true;
      if (theData.length > 0) {
        /* build summary */
        content = content.replace(/{summaryContent}/, mlog.entriesControl.getSummary());
        if (hideSummary) {
          /* apply hide style */
          content = content.replace(/show_next/, 'hide_next');
          content = content.replace(/id="entries_summary"/i, 'id="entries_summary" style="display: none"');
        }
        /* build entries */
        res += tp.tHead;
        for (var i = 0; i < theData.length - 1; i++) {
          /* apply template tRow or tRowFuture */
          if (theData[i][0] <= currentDate) {
            /* apply odd or even template */
            strRow = odd ? tp.tRowOdd : tp.tRow;
          }
          else {
            strRow = odd ? tp.tRowFutureOdd : tp.tRowFuture;
          }
          odd = !odd;
          /* is reconcilable? */
          if (theData[i][6]) {
            strRow = strRow.replace(/opt_ok hide/, 'opt_ok');
            strRow = strRow.replace(/(row-a|row-b)/, 'row_reconcilable');
          }
          /* the total */
          theTotal += theData[i][1];
          /* apply values to detail row */
          strRow = strRow.replace(/rowId/, 'n_' + theData[i][5]);
          strRow = strRow.replace(/{date}/, theData[i][0]);
          strRow = strRow.replace(/{value}/, mlog.base.formatFloat(theData[i][1]));
          strRow = strRow.replace(/{description}/, theData[i][2]);
          strRow = strRow.replace(/{category}/, theData[i][3]);
          strRow = strRow.replace(/{account}/, theData[i][4]);
          res += strRow;
        }
        /* end of data, put total */
        strRow = tp.tRowTotal.replace(/{totalvalue}/, mlog.base.formatFloat(theTotal));
        strRow = strRow.replace(/{entriescount}/, theData.length - 1);
        res += strRow;
        /* assemble table */
        content = content.replace(/{entriesContent}/, res);
        var maxPage = theData.pop().maxPage || 1;
        content += mlog.entriesControl.buildPaginator(maxPage) + '<br />';
      }
      else {
        content = '<h1>' + mlog.translator.get('no data') + '</h1>';
      }
      $('#report').html(content);
      $('#toggle_summary').click(function(){
        $(this).toggleClass('hide_next').toggleClass('show_next').next('div').slideToggle("slow");
        hideSummary = !hideSummary;
      });
      /* bind click event on each column */
      $('td.entry').click(function(){
        mlog.entriesControl.onClickEntry(this);
      });
    },

    /* sort table column */
    sortCol: function(index){
      filterOptions.sortReverse = (filterOptions.sortColIndex != index) ? false : !filterOptions.sortReverse;
      filterOptions.sortColIndex = index;
      this.show();
    },

    /* clear entry form */
    clearEntry: function(){
      $('#input_date').val(mlog.base.getCurrentDate());
      $('#input_value').val('');
      $('#input_pending').attr('checked', '');
      $('#input_description').val('');
      $('#input_category').val('');
      $('#input_account').val('');
      $('#input_account_to').val('');
      $('#input_date').focus();
    },

    /* add an entry from input */
    addEntry: function(elem){
      var entry = [$('#input_date').val(), $('#input_value').val(), $('#input_description').val(), $('#input_category').val(), $('#input_account').val(), $('#input_account_to').val()];
      /* is it reconcilable */
      entry[0] += $('#input_pending').attr('checked') ? '?' : '';
      var addCount = mlog.entries.getCount();
      mlog.entries.add(entry);
      /* refresh entries */
      this.show();
      mlog.entriesControl.updateTagCloud();
      /* blink add button */
      $(elem).fadeOut('fast').fadeIn('fast');
      /* apply style to new entry */
      var newCount = mlog.entries.getCount();
      addCount = newCount - addCount;
      for (var i = 1; i <= addCount; i++) {
        /* stylise new entries */
        $('#n_' + (newCount - i)).addClass('new_entry');
      }
      /* initial state and update autocompleters */
      $('#transfer').hide();
      $('#input_date').focus();
      $('#input_category').setOptions({
        data: mlog.categories.getNames()
      });
      $('#input_account').setOptions({
        data: mlog.accounts.getNames()
      });
      $('#input_account_to').val('').setOptions({
        data: mlog.accounts.getNames()
      });
      if ($('#input_auto_clear').attr('checked')) {
        this.clearEntry();
      }
    },
    /* toggle 'to account' */
    toggleToAccount: function(){
      if ($('#input_category').val() == '') {
        $('#transfer').show();
      }
      else {
        $('#transfer').hide();
      }
    },
    onPageChange: function(){
      filterOptions.entriesPerPage = parseInt($('#entriesPerPage option:selected').attr('value') || 50);
      mlog.entriesControl.show(parseInt($('#select_page option:selected').attr('value')));
    },
    reconcileEntry: function(elem){
      var id = elem.parentNode.parentNode.getAttribute('id').substring(2);
      if (confirm(mlog.translator.get('conciliate').toUpperCase() + ': ' + mlog.translator.get('are you sure?'))) {
        mlog.entries.reconcile(id);
        this.show();
        $('#n_' + (mlog.entries.getCount() - 1)).addClass('new_entry');
      }
    },
    /* read options panel and set to variables*/
    updateOptions: function(){
      var selectedCategories = [];
      $.each($('#entries_category_cloud .tagSelect'), function(i, v){
        selectedCategories.push($(v).html());
      });
      var selectedAccounts = [];
      $.each($('#entries_account_cloud .tagSelect'), function(i, v){
        selectedAccounts.push($(v).html());
      });
      filterOptions.query = $.trim($('#filter_query').val());
      filterOptions.entriesPerPage = parseInt($('#entriesPerPage option:selected').attr('value') || 50);
      filterOptions.startDate = $('#filter_date_from').val();
      filterOptions.endDate = $('#filter_date_until').val();
      filterOptions.values = parseInt($('#filter_values option:selected').attr('value')) || 0;
      filterOptions.categories = selectedCategories;
      filterOptions.accounts = selectedAccounts;
      /* update stored searches */
      if (filterOptions.query != '' && $.inArray(filterOptions.query, storedSearches) < 0) {
        storedSearches.unshift(filterOptions.query);
        var str = storedSearches.join('~');
        while (str.length > 1024) {
          storedSearches.pop();
          str = storedSearches.join('~');
        }
        mlog.base.setCookie('storedSearches', str, 120);
        /* refresh filter autocomplete */
        $('#filter_query').setOptions({
          data: storedSearches
        });
      }
    },
    applyOptions: function(){
      this.updateOptions();
      this.show();
    },
    updateTagCloud: function(){
      $('#entries_category_cloud').html(mlog.base.arrayToTagCloud(mlog.categories.getAll(), 1));
      $('#entries_account_cloud').html(mlog.base.arrayToTagCloud(mlog.accounts.getAll(), 2));
      // mark selected categories
      if (filterOptions.categories.length > 0) {
        var regex = eval('/(' + filterOptions.categories.join('|') + ')/i');
        if (regex !== undefined) {
          $.each($('#entries_category_cloud').children(), function(i, v){
            if (regex.test($(v).html()))
              $(v).addClass('tagSelect');
          });
        }
      }
      // mark selected accounts
      if (filterOptions.accounts.length > 0) {
        regex = eval('/(' + filterOptions.accounts.join('|') + ')/i');
        if (regex !== undefined) {
          $.each($('#entries_account_cloud').children(), function(i, v){
            if (regex.test($(v).html()))
              $(v).addClass('tagSelect');
          });
        }
      }
    },
    resetFilter: function(){
      resetFilterOptions();
      this.show();
    },
    /* build paginator */
    buildPaginator: function(numberOfPages){
      var currentPg = filterOptions.pageNumber;
      var maxPg = numberOfPages || 1;
      var entriesPerPage = filterOptions.entriesPerPage;
      var str = [];
      var perPageOption = [20, 50, 100, 200, 500, 1000]; // entries per page options
      str.push('<div class="pagination">');
      str.push('<select id="entriesPerPage" onchange="mlog.entriesControl.onPageChange()">');
      for (var i = 0; i < perPageOption.length; i++) {
        if (perPageOption[i] == entriesPerPage) {
          str.push('<option value="' + perPageOption[i] + '" selected="selected">' + perPageOption[i] + '</option>');
        }
        else {
          str.push('<option value="' + perPageOption[i] + '">' + perPageOption[i] + '</option>');
        }
      }
      str.push('</select>&nbsp;<span class="msg">' +
      mlog.translator.get('per page') +
      '</span>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
      var prevPg = (currentPg - 1 > 0) ? currentPg - 1 : currentPg;
      str.push('<a onclick="mlog.entriesControl.show(' + prevPg + ')">&laquo;</a>');
      str.push('&nbsp;' + mlog.translator.get('page') + '&nbsp;');
      str.push('<select id="select_page" onchange="mlog.entriesControl.onPageChange()">');
      for (i = 1; i <= maxPg; i++) {
        if (i == currentPg) {
          str.push('<option value="' + i + '" selected="selected">' + i + '</option>');
        }
        else {
          str.push('<option value="' + i + '">' + i + '</option>');
        }
      }
      str.push('</select>&nbsp;' + mlog.translator.get('of') + '&nbsp;' + maxPg + '&nbsp;');
      var nextPg = (currentPg + 1 <= maxPg) ? currentPg + 1 : currentPg;
      str.push('<a onclick="mlog.entriesControl.show(' + nextPg + ')">&raquo;</a>');
      str.push('</div>');
      return str.join('');
    }
  };
}();
