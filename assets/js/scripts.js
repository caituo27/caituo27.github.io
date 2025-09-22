// A $( document ).ready() block.
$( document ).ready(function() {

	// DropCap.js
	var dropcaps = document.querySelectorAll(".dropcap");
	window.Dropcap.layout(dropcaps, 2);

        // Responsive-Nav
        var nav = responsiveNav(".nav-collapse");

        // Round Reading Time
        $(".time").text(function (index, value) {
                return Math.round(parseFloat(value));
        });

        // Logo animation effect
        (function () {
                var $logoLinks = $(".logo a");

                if (!$logoLinks.length) {
                        return;
                }

                var animationDuration = 900;

                $logoLinks.each(function () {
                        var $link = $(this);
                        var originalText = $.trim($link.text());

                        if (!originalText) {
                                return;
                        }

                        var characters = originalText.split("");
                        var totalChars = characters.length;
                        var wrappedHtml = characters
                                .map(function (char, index) {
                                        var safeChar = $("<div />").text(char).html();
                                        var displayChar = char === " " ? "&nbsp;" : safeChar;
                                        var offset = index - (totalChars - 1) / 2;

                                        return (
                                                '<span class="logo__char" style="--char-offset:' +
                                                offset +
                                                ';">' +
                                                displayChar +
                                                "</span>"
                                        );
                                })
                                .join("");

                        $link
                                .attr("aria-label", originalText)
                                .attr("data-logo-text", originalText)
                                .html(wrappedHtml);

                        var isAnimating = false;

                        $link.on("click", function (event) {
                                if (
                                        event.metaKey ||
                                        event.ctrlKey ||
                                        event.shiftKey ||
                                        event.altKey ||
                                        (typeof event.which === "number" && event.which !== 1)
                                ) {
                                        return;
                                }

                                event.preventDefault();

                                if (isAnimating) {
                                        return;
                                }

                                var href = $link.attr("href");
                                var absoluteHref = "";

                                if (href && href !== "#") {
                                        absoluteHref = resolveHref(href);
                                }

                                isAnimating = true;

                                $link.removeClass("logo--animating");
                                // Force reflow so the animation can restart when the class is re-applied
                                void this.offsetWidth;
                                $link.addClass("logo--animating");

                                window.setTimeout(
                                        function () {
                                                $link.removeClass("logo--animating");
                                                isAnimating = false;

                                                if (absoluteHref && !isSamePage(absoluteHref)) {
                                                        window.location.href = absoluteHref;
                                                }
                                        },
                                        animationDuration
                                );
                        });
                });

                function resolveHref(href) {
                        var parser = document.createElement("a");
                        parser.href = href;

                        return parser.href;
                }

                function isSamePage(url) {
                        if (!url) {
                                return true;
                        }

                        var parser = document.createElement("a");
                        parser.href = url;

                        var normalise = function (path) {
                                return path.replace(/\/+$/, "") || "/";
                        };

                        return normalise(parser.pathname) === normalise(window.location.pathname);
                }
        })();

});


