import React from 'react';
import { 
  Grid, 
  MoreHorizontal, 
  ChevronDown, 
  Link as LinkIcon, 

  Camera, 
  Play, 
  User, 
  Lock,
  ArrowLeft,
  Settings,
  Menu,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Home,
  Search,
  PlusSquare,
  ShoppingBag
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

const InstagramPreSell: React.FC = () => {
  const posts = [
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=500&fit=crop' },
    { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&h=500&fit=crop' },
    { id: 3, type: 'video', url: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&h=500&fit=crop' },
    { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=500&fit=crop' },
    { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=500&h=500&fit=crop' },
    { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=500&h=500&fit=crop' },
    { id: 7, type: 'image', url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop' },
    { id: 8, type: 'image', url: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?w=500&h=500&fit=crop' },
    { id: 9, type: 'image', url: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=500&h=500&fit=crop' },
  ];

  const highlights = [
    { id: 1, title: '🔥 Promo', img: 'https://images.unsplash.com/photo-1615361958556-9aba44a69624?w=150&h=150&fit=crop' },
    { id: 2, title: '🍱 Menu', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop' },
    { id: 3, title: '⭐ Avaliações', img: 'https://images.unsplash.com/photo-1490818387583-1baba5e6382b?w=150&h=150&fit=crop' },
    { id: 4, title: '🛵 Delivery', img: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?w=150&h=150&fit=crop' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen font-sans text-[#262626] pb-16">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb]">
        <div className="flex items-center gap-2">
          <ArrowLeft size={24} />
          <span className="font-bold text-lg">rushisushi_oficial</span>
          <div className="bg-[#0095f6] rounded-full p-0.5 ml-0.5">
            <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-3.3-3.3 1.4-1.4 1.9 1.9 4.6-4.6 1.4 1.4-6 6z"></path>
            </svg>
          </div>
        </div>
        <div className="flex gap-4">
          <Settings size={24} />
          <Menu size={24} />
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                <img 
                  src="https://storage.googleapis.com/gpt-engineer-file-uploads/rg3w3Jfg0xU8eg2GMj9PmqMpkJz2/social-images/social-1780448423541-logo-preto.webp" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-around text-center px-4">
            <div>
              <div className="font-bold">1.248</div>
              <div className="text-xs">Publicações</div>
            </div>
            <div>
              <div className="font-bold">12,5k</div>
              <div className="text-xs">Seguidores</div>
            </div>
            <div>
              <div className="font-bold">842</div>
              <div className="text-xs">Seguindo</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="font-bold text-sm">Rūshī Sushi - Original 🍣</h1>
          <p className="text-sm text-[#8e8e8e]">Restaurante de Sushi</p>
          <div className="text-sm mt-1 whitespace-pre-wrap">
            🇯🇵 O melhor da culinária japonesa na sua casa!<br/>
            🚚 Entrega grátis nas primeiras ordens do dia<br/>
            ⭐ +10.000 clientes satisfeitos<br/>
            👇 PEÇA AGORA COM DESCONTO ESPECIAL
          </div>
          <a 
            href="/" 
            className="flex items-center gap-1 text-[#00376b] text-sm font-semibold mt-1"
          >
            <LinkIcon size={14} />
            pedir.rushisushi.com.br/promocao-hoje
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <Link 
            to="/" 
            className="flex-1 bg-[#0095f6] text-white text-sm font-semibold py-1.5 rounded-lg text-center"
          >
            Fazer Pedido
          </Link>
          <button className="flex-1 bg-[#efefef] text-black text-sm font-semibold py-1.5 rounded-lg">
            Mensagem
          </button>
          <button className="bg-[#efefef] p-1.5 rounded-lg">
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Highlights */}
        <div className="flex gap-4 overflow-x-auto no-scroll pb-2 mb-4">
          {highlights.map((highlight) => (
            <Link 
              key={highlight.id} 
              to="/"
              className="flex flex-col items-center flex-shrink-0 active:opacity-70 transition-opacity"
            >
              <div className="w-16 h-16 rounded-full border border-[#dbdbdb] p-0.5 mb-1 bg-white">
                <img 
                  src={highlight.img} 
                  alt={highlight.title} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-[11px] font-medium">{highlight.title}</span>
            </Link>
          ))}

          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full border border-[#dbdbdb] flex items-center justify-center mb-1">
              <PlusSquare size={24} strokeWidth={1} />
            </div>
            <span className="text-[11px] font-medium">Novo</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-[#dbdbdb]">
        <button className="flex-1 flex justify-center py-3 border-t-2 border-black">
          <Grid size={24} strokeWidth={2} />
        </button>
        <button className="flex-1 flex justify-center py-3 text-[#8e8e8e]">
          <Play size={24} strokeWidth={1.5} />
        </button>
        <button className="flex-1 flex justify-center py-3 text-[#8e8e8e]">
          <User size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((post) => (
          <Link 
            key={post.id}
            to="/" 
            className="aspect-square relative group overflow-hidden"
          >
            <img 
              src={post.url} 
              alt={`Post ${post.id}`} 
              className="w-full h-full object-cover group-active:scale-105 transition-transform"
            />
            {post.type === 'video' && (
              <div className="absolute top-2 right-2 text-white">
                <Play size={18} fill="white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-active:opacity-100 transition-opacity" />
          </Link>
        ))}

      </div>

      {/* Bottom Nav Simulation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-[#dbdbdb] flex justify-around py-2 z-20">
        <Home size={26} />
        <Search size={26} />
        <PlusSquare size={26} />
        <ShoppingBag size={26} />
        <div className="w-6 h-6 rounded-full overflow-hidden border border-[#dbdbdb]">
          <img src="https://i.pravatar.cc/100" alt="Me" />
        </div>
      </div>
    </div>
  );
};

export default InstagramPreSell;
