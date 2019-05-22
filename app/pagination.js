var el = document.getElementById('pagination');
var pagination = {
    currentPage: 1,
    pageLength: 10,
    totalRecords: 60,
    render: function () {
        this.totalRecords = todoService.getTodoCount();
        let pages = Math.ceil(this.totalRecords / this.pageLength);
        this.pages = pages;
        let buttons = "";
        buttons += `
        <button class="btn btn-primary pagination-btn prev mr-2" type="button"
        onclick="pagination.prev(this)">prev
        </button>
        `;
        for (i = 1; i <= this.pages; i++) {
            buttons += this.getButton(i);
        }
        buttons += `
        <button class="btn btn-primary pagination-btn mr-2" type="button" onclick="pagination.next(this)">next
        </button>
        `;
        el.innerHTML = buttons;
    },
    getButton: function (text) {
        let classNames = ' btn btn-primary mr-2 pagination-btn';
        if (this.currentPage == text) {
            classNames += ' current-page';
        }
        let html = `<button id="${text}" class="${classNames}" type="button"
        onclick="pagination.gotoPage(this,${text})">${text}</button>`;
        return html;
    },
    gotoPage: function (btn, pageNo) {
        this.currentPage = pageNo;
        let pageData = todoService.getPagesData(pageNo, this.pageLength);
        todoApp.render(pageData);
    },
    gotoLastPage: function () {
        this.currentPage = this.pages;
        this.currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(this.currentPageBtn, this.currentPage);
    },
    prev: function (btn) {
        if (this.currentPage == 1) return;
        this.currentPage = this.currentPage - 1;
        let currentPageBtn = document.getElementById(`btn${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);
    },
    next: function (btn) {
        if (this.currentPage > this.pages - 1) return;
        this.currentPage = this.currentPage + 1;
        let currentPageBtn = document.getElementById(`btn${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);
    }
}
this.pagination.render();