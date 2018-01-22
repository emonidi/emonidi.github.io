export const titleOnly = (title) => {
   return `<button class="typeahead-list-item title-only list-group-item" data-title="${title}">
       <div class="title strong"><strong data-title>${title}</strong></div>
    </button>`;
}

export const titleSubtitle = (title,subtitle) => {
    return `<button class="typeahead-list-item title-subtitle list-group-item" data-title="${title}">
        <div class="title"><strong>${title}</strong></div>
        <div class="subtitle">${subtitle}</div>
    </button>`;
};

export const titleSubtitleImage = (title,subtitle,image) => {
    return `<button class="typeahead-list-item title-subtitle-image list-group-item" data-title="${title}">
        <div clas="row">
            <div class="col-xs-2 image-holder">
                <img class="img-fluid img-thumbnail rounded mx-auto d-block" src='${image}'/>
            </div>
            <div class="col-xs-10 text-holder">
                <div class="title"><strong>${title}</strong></div>
                <div class="subtitle">${subtitle}</div>
            </div>
        </div>
</button>`
};