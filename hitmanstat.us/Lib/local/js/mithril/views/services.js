﻿var services = services || {};
var dateFormat = 'YYYY.MM.DD hh:mmA';

services.oncreate = function () {
    window.addEventListener("load", function () {
        services.refresh();
    });
};

services.view = function () {
    return [
        setServicesGroup(services, "h1"),
        setServicesGroup(services, "h2"),
        m("h3", ["Other", m("small", { class: "text-muted" }, " services")]),
        setServicesGroup(services, "ot")
    ]
};

function setServicesGroup(services, groupName) {
    return m("div", { class: "card-deck" }, services.list.map(function (service) {
        if (service.group == groupName) {
            return [
                m("div", { class: "card" }, [
                    m("div", { class: setHeaderClass(service) }),
                    m("div", { class: "card-body" }, [
                        m("h5", { class: "card-title" }, service.name),
                        setState(service)
                    ]),
                    m("ul", { class: "list-group list-group-flush" }, [
                        setMaintenance(service),
                        setElusive(service)
                    ]),
                    m("div", { class: "card-footer" }, [
                        m("small", {
                            class: "text-muted"
                        }, "Last updated : " + moment(service.lastCheck).fromNow()),
                        setLink(service)
                    ])
                ]),
                setElusiveModal(service),
                setMaintenanceModal(service),
            ]
        }
    }));
}

function setHeaderClass(service) {
    var status = (service.status) ? service.status.toLowerCase() : "loading";
    return "card-header " + status;
}

function setState(service) {
    var status = (service.status) ? service.status.toLowerCase() : "loading...";
    var title = (service.title) ? " - " + service.title : "";
    var label = (status == "up") ? "online" : status;
    return m("p", {
        class: "card-text " + status
    }, label + title);
}

function setLink(service) {
    if (service.url) {
        return m("a", {
            class: "btn btn-outline-secondary btn-sm float-right", href: service.url
        }, "Website")
    }
}

function setElusive(service) {
    if (service.elusive && service.ref) {
        var modalId = "#" + service.ref + "_elusive";
        return m("li", {
            class: "list-group-item elusive-target bg-info",
            "data-toggle": "modal",
            "data-target": modalId
        }, "Elusive target : " + service.elusive.name);
    }
}

function setMaintenance(service) {
    if (service.nextWindow && service.ref) {
        var modalId = "#" + service.ref + "_maintenance";
        var start = moment(service.nextWindow.start);
        var state = (moment().isAfter(start)) ? "Maintenance in progress" : "Maintenance scheduled";
        return m("li", {
            class: "list-group-item maintenance",
            "data-toggle": "modal",
            "data-target": modalId
        }, state);
    }
}

function setElusiveModal(service) {
    if (service.elusive && service.ref) {
        var modalId = service.ref + "_elusive";
        var start = moment(service.elusive.nextWindow.start);
        var end = moment(service.elusive.nextWindow.end);
        var duration = moment.duration(start.diff(moment()));
        return m("div", { class: "modal fade", id: modalId, role: "dialog" },
            m("div", { class: "modal-dialog modal-dialog-centered", role: "document" },
                m("div", { class: "modal-content" }, [
                    m("div", { class: "modal-header" }, [
                        m("h5", { class: "modal-title" }, service.elusive.name),
                        m("button", { class: "close", type: "button", "data-dismiss": "modal" },
                            m("span", m.trust("&times"))
                        )
                    ]),
                    m("div", { class: "modal-body" }, [
                        m("div", {
                            class: "alert alert-secondary", role: "alert"
                        }, m.trust(service.elusive.description)),
                        m("table", { class: "table" }, [
                            m("tr", [m("th", "Name"), m("td", service.elusive.name)]),
                            m("tr", [m("th", "Location"), m("td", service.elusive.location)]),
                            m("tr", [m("th", "Start date"), m("td", start.format(dateFormat))]),
                            m("tr", [m("th", "End date"), m("td", end.format(dateFormat))]),
                            m("tr", [m("th", "Duration"), m("td", end.diff(start, 'days') + ' days')]),
                            m("tr", [m("th", (moment().isAfter(start)) ? 'Started since' : 'Start in'), m("td", duration.humanize())]),
                        ])
                    ]),
                    m("div", { class: "modal-footer" },
                        m("button", { class: "btn btn-info", "data-dismiss":"modal" }, "Close")
                    )
                ])
            )
        )
    }
}

function setMaintenanceModal(service) {
    if (service.nextWindow && service.ref) {
        var modalId = service.ref + "_maintenance";
        var start = moment(service.nextWindow.start);
        var end = moment(service.nextWindow.end);
        var duration = moment.duration(start.diff(moment()));
        return m("div", { class: "modal fade", id: modalId, role: "dialog" },
            m("div", { class: "modal-dialog modal-dialog-centered", role: "document" },
                m("div", { class: "modal-content" }, [
                    m("div", { class: "modal-header" }, [
                        m("h5", { class: "modal-title" }, (moment().isAfter(start)) ? "Maintenance in progress" : "Maintenance scheduled"),
                        m("button", { class: "close", type: "button", "data-dismiss": "modal" },
                            m("span", m.trust("&times"))
                        )
                    ]),
                    m("div", { class: "modal-body" }, [
                        m("div", {
                            class: "alert alert-info", role: "alert"
                        }, "All online features are unavailable during maintenance. However, the game remains playable in offline mode."),
                        m("table", { class: "table" }, [
                            m("tr", [m("th", (moment().isAfter(start)) ? 'Started since' : 'Start in'), m("td", duration.humanize())]),
                            m("tr", [m("th", "Duration"), m("td", end.diff(start, 'hours') + ' hours')]),
                            m("tr", [m("th", "Start date"), m("td", start.format(dateFormat))]),
                            m("tr", [m("th", "End date"), m("td", end.format(dateFormat))])
                            
                        ])
                    ]),
                    m("div", { class: "modal-footer" },
                        m("button", { class: "btn btn-info", "data-dismiss": "modal" }, "Close")
                    )
                ])
            )
        )
    }
}

m.mount(servicesView, services);