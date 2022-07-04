Hawk.SectionDetector = class {
	constructor(element, sections, options) {
		this.element = $(element);
		this.sections = sections;

		this.scrollY = 0;

		this.defaultOptions = {
			offset: 0,

			onSectionInRange: (sectionDetector, sectionInRange) => {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	getScrollY() { 
		return this.scrollY;
	}

	getElementBottomEdge() {
		return this.element.position().top + this.element.outerHeight();
	}

	getElementTopEdge() {
		return this.element.position().top;
	}

	getElementLeftEdge() {
		return this.element.position().left;
	}

	getSectionBottomEdge(section) {
		return section.offset().top + section.outerHeight() - this.getScrollY();
	}

	getSectionLeftEdge(section) {
		return section.offset().left;
	}

	getSectionRightEdge(section) {
		return section.offset().left + section.outerWidth();
	}

	getSectionTopEdge(section) {
		return section.offset().top - this.getScrollY();
	}

	checkIfSectionInRange(section) {
		return this.getSectionTopEdge(section) <= this.getElementTopEdge()
					&& this.getSectionLeftEdge(section) <= this.getElementLeftEdge()
					&& this.getSectionRightEdge(section) > this.getElementLeftEdge()
					&& this.getSectionBottomEdge(section) >= this.getElementBottomEdge();
	}

	checkSections() {
		const that = this;

		this.sections.each(function() {
			// console.log();
			// console.log("____________________________________");
			// console.log("scrollTop: " + that.getScrollY());
			// console.log("Element top: " + that.getElementTopEdge());
			// console.log("Element bottom: " + that.getElementBottomEdge());

			if (that.checkIfSectionInRange($(this))) {
				// console.log($(this).attr('class') + " offset top:::::::::: " + $(this).offset().top);
				// console.log($(this).attr('class') + " top edge:::::::: " + that.getSectionTopEdge($(this)));
				// console.log($(this).attr('class') + " bottom edge::::::::: " + that.getSectionBottomEdge($(this)));
				

				that.options.onSectionInRange(that, $(this));
			}
			// else if ($(this).hasClass('section-08')) {
			// 	console.log($(this).attr('class') + " offset top: " + $(this).offset().top);
			// 	console.log($(this).attr('class') + " top edge: " + that.getSectionTopEdge($(this)));
			// 	console.log($(this).attr('class') + " bottom edge: " + that.getSectionBottomEdge($(this)));
			// }
		});
	}

	run() {
		$(window).scroll((e) => {
			this.scrollY = $(window).scrollTop();

			this.checkSections();
		});

		//setTimeout(() => {
			this.scrollY = $(window).scrollTop();

			this.checkSections();
		//}, 200);
	}
}