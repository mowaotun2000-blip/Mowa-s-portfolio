/* Mowa Portfolio — Review cycling (mobile, tap only, no hover) */
(function () {
  var reviews = [
    {
      quote: "I had the pleasure of mentoring Mowa, a talented and thoughtful product designer with a strong mix of product thinking and craft. She\u2019s incredibly proactive and dedicated, always taking feedback seriously.",
      author: "Arielle Ferreira",
      role:   "Lead Product Designer",
      company:"Jobget",
      photo:  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
    },
    {
      quote: "Her design skills are exceptional, and she consistently delivers clean, user-focused solutions. Mowa is reliable, collaborative, and brings a positive attitude to every task.",
      author: "Hassan Oladipupo",
      role:   "Product Team",
      company:"Build Africa",
      photo:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      quote: "An exceptional product designer who blends aesthetics with functionality beautifully. Every design decision was intentional, research-backed, and user-centred.",
      author: "Elena Rodriguez",
      role:   "Product Lead",
      company:"Build Africa AI",
      photo:  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ];

  var idx = 0;

  function render() {
    var r = reviews[idx];
    q('[data-r-quote]',   function(el){ el.textContent = '\u201c' + r.quote + '\u201d'; });
    q('[data-r-author]',  function(el){ el.textContent = r.author;  });
    q('[data-r-role]',    function(el){ el.textContent = r.role;    });
    q('[data-r-company]', function(el){ el.textContent = r.company; });
    q('[data-r-photo]',   function(el){ el.src = r.photo; el.alt = r.author; });
    q('[data-r-dot]',     function(el, i){ el.style.opacity = i === idx ? '1' : '0.3'; });
  }

  function q(sel, fn) {
    document.querySelectorAll(sel).forEach(function(el, i){ fn(el, i); });
  }

  function next() { idx = (idx + 1) % reviews.length; render(); }
  function prev() { idx = (idx - 1 + reviews.length) % reviews.length; render(); }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    q('[data-action="next"]',  function(el){ el.addEventListener('click', function(e){ e.stopPropagation(); next(); }); });
    q('[data-action="prev"]',  function(el){ el.addEventListener('click', function(e){ e.stopPropagation(); prev(); }); });
    q('[data-action="cycle"]', function(el){ el.addEventListener('click', next); });
  });
})();
