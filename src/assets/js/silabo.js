var formUI = {
    test: true,
    init: function () {
        this.addValidateButtons("#trabajos-taller");
        this.bindEvents();
    },
    bindEvents: function () {
        // Elementos plegables
        $("body").on("click", ".btn-form.step-enable", function () {
            var $this = $(this);
            var $target = $this.data("target");

            $("body").find(".collapsed").removeClass("is-active");
            $this.addClass("is-active");

            $("body").find(".collapse").removeClass("show");
            $($target).addClass("show");
        });

        // Validaciones
        $("body").on("click", ".btn-validate-section", function (e) {
            e.preventDefault();
            let $group = $(this).closest(".group-form");
            let $id = $group.attr("id");
            let check = formUI.validaCamposRequeridos("#" + $id);

            if (check) {
                $group.addClass("is-valid").removeClass("show");
                $group.prev().addClass("is-valid");
                $group.next().addClass("step-enable");

                var $trg = $group.next().data("target");
                $("body").find($trg).addClass("show");
            } else {
                $group.removeClass("is-valid");
                $group.prev().removeClass("is-valid");
                $group.next().removeClass("step-enable");
            }
        });

        $("body").on("keyup", ".text", function () {
            let $this = $(this);
            $this.val($this.val().replace(/[^a-zA-Z_-]/g, ""));
        });

        $("body").on("keyup", ".decimal,.entero", function () {
            let $this = $(this);
            $this.val($this.val().replace(/[^0-9,.]/g, ""));
        });

        $("body").on("blur", ".decimal", function () {
            let $this = $(this);
            if ($this.val() != "") {
                let $val = $this.val().replace(",", ".");
                let num = parseFloat($val);
                let cleanNum = num.toFixed(2);

                $this.val(cleanNum);
            }
        });
    },
    addValidateButtons: function (formID) {
        let $form = $("body " + formID);
        const $btnValGroup = `<div class="row bg-black-10 rounded mt-1 mb-2"><div class="col-12 text-right pt-2 pb-2"><button class="btn btn-validate-section btn-sm btn-primary">Validar sección <i class="fas fa-chevron-right"></i></button></div></div>`;

        let $group = $form.find(".group-form");

        $.each($group, function (i, v) {
            $(this).append($btnValGroup);
        });
    },
    validaCamposRequeridos: function (formGroupID) {
        let $form = $("body " + formGroupID);
        let $fields = $form.find(".required");
        let $regNum = /[0-9]$/;
        let $regDec = /[0-9](,[0-9]{2})/;
        let $valid = true;

        if (formUI.test === false) {
            $.each($fields, function (i, v) {
                let $this = $(this);
                let $isnum = $this.is(".decimal, .entero");

                if ($isnum === true && $regNum.test($this.val()) === false) {
                    $this.addClass("error");
                    $valid = false;
                } else if ($this.val().length <= 0) {
                    $this.addClass("error");
                    $valid = false;
                } else {
                    $this.removeClass("error");
                }
            });

            if ($valid == false) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
    vaciaFormulario: function (formGroupID) {
        let $form = $("body " + formGroupID);
        $form[0].reset();
    }
};

$(function () {
    formUI.init();

    $.datetimepicker.setLocale("pt");
    $(".datetimepicker").datetimepicker({
        timepicker: false,
        dayOfWeekStart: 1,
        format: "d/m/Y"
    });
});